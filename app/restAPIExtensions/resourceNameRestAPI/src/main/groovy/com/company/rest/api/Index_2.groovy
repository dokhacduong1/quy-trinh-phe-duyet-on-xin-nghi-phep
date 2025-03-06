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

class Index_2 implements RestApiController {



    @Override
    RestApiResponse doHandle(HttpServletRequest request, 
                             RestApiResponseBuilder responseBuilder, 
                             RestAPIContext context) {
        
        def result = [ 'message': 'Hello from Groovy!' ]
		return responseBuilder.with {
			withResponseStatus(200)
			withResponse(new JsonBuilder( [ 'message': 'Hello from Groovy2!' ]).toString())
			build()
		}
       
    }

}
