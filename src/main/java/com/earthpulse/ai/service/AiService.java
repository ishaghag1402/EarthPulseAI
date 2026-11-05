
package com.earthpulse.ai.service;

import org.springframework.stereotype.Service;
import java.util.HashMap;
import java.util.Map;

@Service
public class AiService {

    public Map<String, Object> ask(String question) {

        String q = question.toLowerCase().trim();
        String answer;

        if (q.contains("hello") || q.contains("hi")) {
            answer = "Hello! Welcome to EarthPulse AI. How can I help you?";

        } else if (q.contains("waste")) {
            answer = "Reduce waste by reusing items, recycling materials, avoiding single-use plastics and separating wet and dry waste.";

        } else if (q.contains("rain")) {
            answer = "Rainfall is precipitation in the form of water droplets. It is important for agriculture, water supply and ecosystems.";

        } else if (q.contains("pollution")) {
            answer = "Pollution can be reduced by using public transport, planting trees, recycling waste and avoiding harmful emissions.";

        } else if (q.contains("climate")) {
            answer = "Climate change refers to long-term changes in temperature and weather patterns.";

        } else if (q.contains("water")) {
            answer = "Save water by fixing leaks, turning off taps when not needed and collecting rainwater.";

        } else if (q.contains("tree")) {
            answer = "Trees improve air quality, provide oxygen, support wildlife and help maintain ecological balance.";

        } else if (q.contains("java")) {
            answer = "Java is an object-oriented programming language used to develop desktop, web and mobile applications.";

        } else if (q.contains("python")) {
            answer = "Python is a beginner-friendly programming language used in web development, automation, data science and AI.";

        } else if (q.contains("computer")) {
            answer = "A computer is an electronic device that accepts data, processes it and produces useful information.";

        } else if (q.contains("ai")) {
            answer = "Artificial Intelligence enables computers to perform tasks that normally require human intelligence.";

        } else if (q.contains("thank")) {
            answer = "You're welcome! Feel free to ask another question.";

        } else {
            answer = "I don't have an answer for this question yet. Please try asking about environment, water, waste, pollution, Java, Python or computers.";
        }

        Map<String, Object> result = new HashMap<>();
        result.put("mode", "BASIC");
        result.put("answer", answer);

        return result;
    }
}
