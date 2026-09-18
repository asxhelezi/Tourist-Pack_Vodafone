package com.vodafone.touristpack.service;

import com.google.zxing.BarcodeFormat;
import com.google.zxing.EncodeHintType;
import com.google.zxing.WriterException;
import com.google.zxing.client.j2se.MatrixToImageWriter;
import com.google.zxing.common.BitMatrix;
import com.google.zxing.qrcode.QRCodeWriter;
import com.google.zxing.qrcode.decoder.ErrorCorrectionLevel;
import com.vodafone.touristpack.config.AppProperties;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.Map;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

/**
 * Generates and caches the redemption QR as a PNG. The QR encodes only
 * "{frontend-base-url}/activate/{token}" — the opaque token, never raw
 * user/order data — wrapped in a URL so a customer's phone camera can open
 * it directly (per the "customer scans with their own phone" decision; see
 * the frontend's /activate/[token] page).
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class QrCodeService {

    private static final int SIZE_PX = 320;

    private final AppProperties appProperties;

    public String buildPayload(UUID token) {
        return appProperties.getFrontendBaseUrl() + "/activate/" + token;
    }

    /** Renders the QR as PNG bytes on demand — used to stream the inline email attachment. */
    public byte[] generatePng(UUID token) {
        try {
            QRCodeWriter writer = new QRCodeWriter();
            BitMatrix matrix = writer.encode(
                    buildPayload(token),
                    BarcodeFormat.QR_CODE,
                    SIZE_PX,
                    SIZE_PX,
                    Map.of(EncodeHintType.ERROR_CORRECTION, ErrorCorrectionLevel.M, EncodeHintType.MARGIN, 1));

            ByteArrayOutputStream out = new ByteArrayOutputStream();
            MatrixToImageWriter.writeToStream(matrix, "PNG", out);
            return out.toByteArray();
        } catch (WriterException | IOException e) {
            throw new IllegalStateException("Failed to generate QR code for token " + token, e);
        }
    }

    /**
     * Caches the PNG on local disk (see app.qr-storage-dir) and returns its
     * path. Swap for an S3-equivalent upload before a multi-instance/prod
     * deploy — local disk won't survive across instances or restarts.
     */
    public String generateAndStore(UUID token) {
        byte[] png = generatePng(token);
        try {
            Path dir = Path.of(appProperties.getQrStorageDir());
            Files.createDirectories(dir);
            Path file = dir.resolve(token + ".png");
            Files.write(file, png);
            return file.toString();
        } catch (IOException e) {
            log.warn("Could not cache QR PNG to disk for token {}, it will be regenerated on demand", token, e);
            return null;
        }
    }
}
