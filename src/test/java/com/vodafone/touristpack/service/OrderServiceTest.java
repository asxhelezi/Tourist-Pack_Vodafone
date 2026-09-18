package com.vodafone.touristpack.service;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import com.vodafone.touristpack.dto.ConfirmPaymentRequest;
import com.vodafone.touristpack.dto.ConfirmPaymentRequest.PaymentOutcome;
import com.vodafone.touristpack.dto.CreateOrderRequest;
import com.vodafone.touristpack.dto.OrderResponse;
import com.vodafone.touristpack.entity.ActivePackage;
import com.vodafone.touristpack.entity.Order;
import com.vodafone.touristpack.entity.TravelPackage;
import com.vodafone.touristpack.entity.User;
import com.vodafone.touristpack.entity.enums.OrderStatus;
import com.vodafone.touristpack.entity.enums.PackageType;
import com.vodafone.touristpack.exception.OrderNotFoundException;
import com.vodafone.touristpack.repository.OrderRepository;
import java.math.BigDecimal;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

@ExtendWith(MockitoExtension.class)
class OrderServiceTest {

    @Mock
    private OrderRepository orderRepository;
    @Mock
    private UserService userService;
    @Mock
    private PackageService packageService;
    @Mock
    private PaymentGatewayService paymentGatewayService;
    @Mock
    private ActivePackageService activePackageService;

    @InjectMocks
    private OrderService orderService;

    private User user;
    private TravelPackage travelPackage;

    @BeforeEach
    void setUp() {
        user = User.builder().id(1L).email("traveler@example.com").firstName("A").lastName("B").build();
        travelPackage = TravelPackage.builder()
                .id(10L)
                .name("Standard Pack")
                .price(BigDecimal.valueOf(1000))
                .currency("ALL")
                .dataAmount(5)
                .minutes(100)
                .durationDays(7)
                .type(PackageType.READY_MADE)
                .active(true)
                .build();
    }

    @Test
    void createOrder_takesPriceFromCatalogue_notFromTheClient() {
        CreateOrderRequest request = new CreateOrderRequest();
        request.setPackageId(10L);
        request.setPaymentMethod("card");
        request.setFirstName("A");
        request.setLastName("B");
        request.setEmail("traveler@example.com");

        when(userService.findOrCreateByEmail(request)).thenReturn(user);
        when(packageService.getById(10L)).thenReturn(travelPackage);
        when(orderRepository.save(any(Order.class))).thenAnswer(inv -> inv.getArgument(0));

        OrderResponse created = orderService.createOrder(request);

        assertThat(created.getStatus()).isEqualTo(OrderStatus.PENDING);
        assertThat(created.getAmount()).isEqualByComparingTo("1000");
        assertThat(created.getCurrency()).isEqualTo("ALL");
        assertThat(created.getUserEmail()).isEqualTo(user.getEmail());
        assertThat(created.getPackageName()).isEqualTo(travelPackage.getName());
    }

    @Test
    void confirmPayment_success_marksOrderPaidAndIssuesActivePackage() {
        Order pendingOrder = Order.builder()
                .id(99L)
                .user(user)
                .travelPackage(travelPackage)
                .amount(travelPackage.getPrice())
                .currency("ALL")
                .paymentMethod("card")
                .status(OrderStatus.PENDING)
                .build();

        when(orderRepository.findById(99L)).thenReturn(java.util.Optional.of(pendingOrder));
        when(paymentGatewayService.resolveOutcome(any())).thenReturn(PaymentOutcome.SUCCESS);
        when(orderRepository.save(any(Order.class))).thenAnswer(inv -> inv.getArgument(0));
        when(activePackageService.issueForOrder(any(Order.class)))
                .thenReturn(ActivePackage.builder().build());

        OrderResponse result = orderService.confirmPayment(99L, new ConfirmPaymentRequest());

        assertThat(result.getStatus()).isEqualTo(OrderStatus.PAID);

        ArgumentCaptor<Order> issuedFor = ArgumentCaptor.forClass(Order.class);
        verify(activePackageService).issueForOrder(issuedFor.capture());
        assertThat(issuedFor.getValue().getId()).isEqualTo(99L);
    }

    @Test
    void confirmPayment_failure_marksOrderFailedAndDoesNotIssueActivePackage() {
        Order pendingOrder = Order.builder()
                .id(100L)
                .user(user)
                .travelPackage(travelPackage)
                .amount(travelPackage.getPrice())
                .currency("ALL")
                .paymentMethod("card")
                .status(OrderStatus.PENDING)
                .build();

        when(orderRepository.findById(100L)).thenReturn(java.util.Optional.of(pendingOrder));
        when(paymentGatewayService.resolveOutcome(any())).thenReturn(PaymentOutcome.FAILURE);
        when(orderRepository.save(any(Order.class))).thenAnswer(inv -> inv.getArgument(0));

        OrderResponse result = orderService.confirmPayment(100L, new ConfirmPaymentRequest());

        assertThat(result.getStatus()).isEqualTo(OrderStatus.FAILED);
        verify(activePackageService, never()).issueForOrder(any());
    }

    @Test
    void confirmPayment_unknownOrder_throws() {
        when(orderRepository.findById(404L)).thenReturn(java.util.Optional.empty());

        org.junit.jupiter.api.Assertions.assertThrows(
                OrderNotFoundException.class, () -> orderService.confirmPayment(404L, null));
    }
}
