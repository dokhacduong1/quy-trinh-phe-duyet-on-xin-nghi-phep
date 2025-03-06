package com.company.rest.utils

import org.bonitasoft.web.extension.ResourceProvider

class PropertiesLoader {

    Properties loadProperties(String fileName, ResourceProvider resourceProvider) {
        Properties props = new Properties()
        resourceProvider.getResourceAsStream(fileName).withStream { InputStream s ->
            props.load s
        }
        return props
    }
}