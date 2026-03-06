package com.store.service;

import java.util.Collections;
import java.util.Map;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.HttpStatusCodeException;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.multipart.MultipartFile;

@Service
public class VoiceService {

    @Value("${openai.api.key}")
    private String openaiApiKey;

    @Value("${openai.whisper.url}")
    private String whisperUrl;

    @SuppressWarnings("unchecked")
    public String transcribeAudio(MultipartFile audioFile) {

        try {
            RestTemplate restTemplate = new RestTemplate();

            HttpHeaders headers = new HttpHeaders();
            headers.setBearerAuth(openaiApiKey);
            headers.setContentType(MediaType.MULTIPART_FORM_DATA);
            headers.setAccept(Collections.singletonList(MediaType.APPLICATION_JSON));

            MultiValueMap<String, Object> body = new LinkedMultiValueMap<>();

            ByteArrayResource fileResource = new ByteArrayResource(audioFile.getBytes()) {
                @Override
                public String getFilename() {
                    return audioFile.getOriginalFilename() != null
                            ? audioFile.getOriginalFilename()
                            : "audio.webm";
                }
            };

            body.add("file", fileResource);
            body.add("model", "whisper-1");

            HttpEntity<MultiValueMap<String, Object>> requestEntity =
                    new HttpEntity<>(body, headers);

            ResponseEntity<Map> response =
                    restTemplate.postForEntity(whisperUrl, requestEntity, Map.class);

            System.out.println("STATUS: " + response.getStatusCode());
            System.out.println("BODY: " + response.getBody());

            if (response.getStatusCode().is2xxSuccessful()
                    && response.getBody() != null
                    && response.getBody().containsKey("text")) {

                return response.getBody().get("text").toString();
            }

            throw new RuntimeException("Invalid OpenAI response: " + response.getBody());

        } catch (HttpStatusCodeException e) {

            // This prints the REAL OpenAI error
            System.out.println("OpenAI ERROR STATUS: " + e.getStatusCode());
            System.out.println("OpenAI ERROR BODY: " + e.getResponseBodyAsString());

            throw new RuntimeException("OpenAI API error: " + e.getResponseBodyAsString());

        } catch (Exception e) {

            e.printStackTrace();
            throw new RuntimeException("Voice transcription error: " + e.getMessage());
        }
    }
}