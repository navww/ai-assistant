# AI-Powered Assistant with Tool Calling

This is a chat-based AI assistant that can call real-world tools to fetch live information and present it in a user-friendly way.

## Tech Stack

-   **Frontend:** Next.js (TypeScript)
-   **Database:** Drizzle ORM with Neon DB
-   **UI:** shadcn/ui components
-   **Authentication:** NextAuth.js (Google & GitHub OAuth)
-   **AI Integration:** Vercel AI SDK (streamText + tool calling)
-   **Gen AI Provider:** OpenAI

## Setup

1.  **Clone the repository:**

    ```bash
    git clone https://github.com/your-username/ai-assistant.git
    ```

2.  **Install dependencies:**

    ```bash
    npm install
    ```

3.  **Set up environment variables:**

    Create a `.env` file in the root of the project and add the following environment variables:

    ```
    DATABASE_URL="your_database_url_here"
    GOOGLE_CLIENT_ID="your_google_client_id_here"
    GOOGLE_CLIENT_SECRET="your_google_client_secret_here"
    GITHUB_CLIENT_ID="your_github_client_id_here"
    GITHUB_CLIENT_SECRET="your_github_client_secret_here"
    AUTH_SECRET="your_auth_secret_here"
    OPENAI_API_KEY="your_openai_api_key_here"
    ```

4.  **Push the database schema:**

    ```bash
    npm run db:push
    ```

5.  **Run the development server:**

    ```bash
    npm run dev
    ```

## Deployment

The application is deployed on Vercel.
