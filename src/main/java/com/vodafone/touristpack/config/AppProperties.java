package com.vodafone.touristpack.config;

import lombok.Getter;
import lombok.Setter;
import org.springframework.boot.context.properties.ConfigurationProperties;

@Getter
@Setter
@ConfigurationProperties(prefix = "app")
public class AppProperties {
    private String frontendBaseUrl;
    private String qrStorageDir;
}
