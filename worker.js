export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    // Allow your website to communicate with the Worker
    const corsHeaders = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type"
    };

    if (request.method === "OPTIONS") {
      return new Response(null, { headers: corsHeaders });
    }

    // Get services from Denzgains
    if (url.pathname === "/services" && request.method === "GET") {
      try {
        const response = await fetch(
          `https://denzgains.com/api/v2?action=services&key=${encodeURIComponent(env.DENZGAINS_API_KEY)}`
        );

        const data = await response.json();

        return new Response(JSON.stringify(data), {
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json"
          }
        });
      } catch (error) {
        return new Response(
          JSON.stringify({ error: "Unable to load services" }),
          {
            status: 500,
            headers: {
              ...corsHeaders,
              "Content-Type": "application/json"
            }
          }
        );
      }
    }

    // Create an order through Denzgains
    if (url.pathname === "/order" && request.method === "POST") {
      try {
        const body = await request.json();

        const params = new URLSearchParams({
          action: "add",
          service: String(body.service),
          link: String(body.link),
          quantity: String(body.quantity),
          key: env.DENZGAINS_API_KEY
        });

        const response = await fetch(
          `https://denzgains.com/api/v2?${params.toString()}`
        );

        const data = await response.json();

        return new Response(JSON.stringify(data), {
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json"
          }
        });
      } catch (error) {
        return new Response(
          JSON.stringify({ error: "Unable to create order" }),
          {
            status: 500,
            headers: {
              ...corsHeaders,
              "Content-Type": "application/json"
            }
          }
        );
      }
    }

    return new Response("Not found", {
      status: 404,
      headers: corsHeaders
    });
  }
};
