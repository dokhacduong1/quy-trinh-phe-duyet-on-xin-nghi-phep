package com.company.rest.api

import groovy.json.JsonBuilder
import javax.servlet.http.HttpServletRequest
import javax.servlet.http.HttpServletResponse
import org.bonitasoft.web.extension.rest.RestApiResponse
import org.bonitasoft.web.extension.rest.RestApiResponseBuilder
import org.bonitasoft.web.extension.rest.RestAPIContext
import org.bonitasoft.web.extension.rest.RestApiController
import org.slf4j.Logger
import org.slf4j.LoggerFactory
import java.time.LocalDate
import com.company.rest.utils.ResponseHelper  // Import từ utils
import com.company.rest.utils.PropertiesLoader // Import từ utils

class Index implements RestApiController {

    private static final Logger LOGGER = LoggerFactory.getLogger(Index.class)
    private final ResponseHelper responseHelper = new ResponseHelper()
    private final PropertiesLoader propertiesLoader = new PropertiesLoader()

    @Override
    RestApiResponse doHandle(HttpServletRequest request, 
                             RestApiResponseBuilder responseBuilder, 
                             RestAPIContext context) {
        
        def result = [ 'message': 'Hello from Groovy!' ]
        return responseHelper.buildResponse(responseBuilder, HttpServletResponse.SC_OK, new JsonBuilder( [ 'message': 'Hello from Groovy2!' ]).toString())
    }

}
