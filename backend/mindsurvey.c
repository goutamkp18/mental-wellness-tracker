#include <stdio.h>
#include <stdlib.h>
#include <string.h>

#define MAX_QUESTIONS 10

// ------------------- MOOD CALCULATION ---------------------
const char* calculateMood(int score) {
    if (score >= 35) return "Ecstatic";
    if (score >= 28) return "High";
    if (score >= 21) return "Moderate";
    if (score >= 14) return "Low";
    return "Very Low";
}

// ------------------- MAIN PROGRAM -------------------------
int main() {
    char input[500];
    int q[11] = {0};
    int total = 0;

    // Read form data from Node.js (POST body)
    if (fgets(input, sizeof(input), stdin) == NULL) {
        printf("{\"error\": \"No input received\"}");
        return 0;
    }

    // Extract q1=q, q2=q ...
    for (int i = 1; i <= 10; i++) {
        char key[10];
        sprintf(key, "q%d=", i);

        char *p = strstr(input, key);
        if (p) q[i] = atoi(p + strlen(key));
        else q[i] = 2; // default
        total += q[i];
    }

    const char *mood = calculateMood(total);

    // -------- JSON OUTPUT MODE (for Node backend) ----------
    // If running from Node, environment variable is set
    char *jsonMode = getenv("JSON_MODE");
    if (jsonMode && strcmp(jsonMode, "1") == 0) {
        printf("{");
        printf("\"score\": %d,", total);
        printf("\"mood\": \"%s\",", mood);

        printf("\"answers\": [");
        for (int i = 1; i <= 10; i++) {
            printf("%d", q[i]);
            if (i < 10) printf(",");
        }
        printf("]");

        printf("}");
        return 0;
    }

    // -------- HTML MODE (when opened as CGI page) ----------
    printf("Content-Type: text/html\n\n");
    printf("<html><body>");
    printf("<h1>Your Mood: %s</h1>", mood);
    printf("<p>Total Score: %d</p>", total);
    printf("</body></html>");

    return 0;
}
