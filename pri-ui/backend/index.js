const { preprocessQuery } = require("./utils");


const express = require("express");
const cors = require("cors");

const app = express();
const port = 3000;

app.use(
  cors({
    origin: "http://localhost:5173", // Allow requests from your frontend
  })
);

// Middleware to parse JSON
app.use(express.json());

// Default Route
app.get("/", (req, res) => {
  res.send("Coutinho, Toto!");
});

app.post("/solr-query", async (req, res) => {
  const { query, sort } = req.body; // Handle both query and sort parameters
  let query3
  
  if (query !== "*:*") {
    query3 = preprocessQuery(query); // Preprocess the query 
  }else{
    query3 = query
  }

  console.log(query)
  console.log(query3)
  let solrUrl = `http://localhost:8983/solr/formula1/select?defType=edismax&df=*&indent=true&pf=summary^5&ps=3&q.op=AND&q=${encodeURIComponent(
    query3
  )}&rows=1125&qf=name^5%20circuit^4%20country^3%20location^2%20weather_condition^2%20summary^2%20drivers^10&useParams=`;

  if (sort) {
    solrUrl += `&sort=${sort}`;
  }

  try {
    const response = await fetch(solrUrl, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    const data = await response.json();
    console.log("Solr Query Results:", data); // Handle the response data
    res.json({
      results: data.response.docs,
    });
  } catch (error) {
    console.error("Solr query error:", error);
    res.status(500).send("Error querying Solr");
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
