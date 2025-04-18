//execute this sql comment to create the database and table before running this java code
//CREATE DATABASE tododb;
//USE tododb;
//CREATE TABLE todos (
//    id INT AUTO_INCREMENT,
//    title VARCHAR(100),
//    content TEXT,
//    PRIMARY KEY (id));

package com.example;

import com.google.gson.Gson;
import java.io.*;
import jakarta.servlet.*;
import jakarta.servlet.http.*;
import java.sql.*;
import java.util.ArrayList;
import java.util.List;
import java.util.logging.Logger;

public class ToDoJava extends HttpServlet {

    private static final Logger logger = Logger.getLogger(ToDoJava.class.getName());

    // Database connection info (update as needed)
    private static final String DB_URL = "jdbc:mysql://localhost:3306/tododb";
    private static final String DB_USER = "root";
    private static final String DB_PASSWORD = "304312";

    private static class ToDo {
        int id;
        String title;
        String content;
    }
    private static class IdRequest {
        int id;
    }

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws IOException {

        response.setContentType("application/json");
        PrintWriter out = response.getWriter();
        Gson gson = new Gson();

        // SQL query to get all todos
        String selectQuery = "SELECT * FROM todos";

        try (Connection conn = DriverManager.getConnection(DB_URL, DB_USER, DB_PASSWORD);
                PreparedStatement stmt = conn.prepareStatement(selectQuery);
                ResultSet rs = stmt.executeQuery()) {

            // Create a list to hold multiple ToDo objects
            List<ToDo> todosList = new ArrayList<>();

            // Iterate over the result set and populate the list
            while (rs.next()) {
                ToDo todo = new ToDo();
                todo.id = rs.getInt("id");
                todo.title = rs.getString("title");
                todo.content = rs.getString("content");

                todosList.add(todo);
            }

            // Convert the list into JSON
            String json = gson.toJson(todosList);

            // Send JSON as response
            out.println(json);

        } catch (SQLException e) {
            logger.severe("Database error: " + e.getMessage());
            response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            out.println("{\"status\": \"error\", \"message\": \"Database error!\"}");
        }
    }

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws IOException {

        response.setContentType("application/json");
        PrintWriter out = response.getWriter();
        Gson gson = new Gson();

        try {
            // Parse JSON from request body
            BufferedReader reader = request.getReader();
            ToDo todo = gson.fromJson(reader, ToDo.class);

            // Validate input
            if (todo == null || todo.title == null || todo.content == null ||
                    todo.title.trim().isEmpty() || todo.content.trim().isEmpty()) {
                response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
                out.println("{\"status\": \"error\", \"message\": \"Missing or empty title/content in JSON!\"}");
                return;
            }

            logger.info("Title: " + todo.title);
            logger.info("Content: " + todo.content);

            // Insert into SQL Database
            String insertQuery = "INSERT INTO todos (title, content) VALUES (?, ?)";

            try (Connection conn = DriverManager.getConnection(DB_URL, DB_USER, DB_PASSWORD);
                    PreparedStatement stmt = conn.prepareStatement(insertQuery)) {

                stmt.setString(1, todo.title);
                stmt.setString(2, todo.content);

                int rowsInserted = stmt.executeUpdate();

                if (rowsInserted > 0) {
                    out.println("{\"status\": \"success\", \"message\": \"Data saved successfully to DB!\"}");
                } else {
                    response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
                    out.println("{\"status\": \"error\", \"message\": \"Failed to insert data into database!\"}");
                }

            } catch (SQLException e) {
                logger.severe("Database error: " + e.getMessage());
                response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
                out.println("{\"status\": \"error\", \"message\": \"Database error!\"}");
            }

        } catch (Exception e) {
            logger.severe("Unexpected error: " + e.getMessage());
            response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            out.println("{\"status\": \"error\", \"message\": \"" + e.getMessage() + "\"}");
        }
    }

    @Override
    protected void doPut(HttpServletRequest request, HttpServletResponse response) throws IOException {
        response.setContentType("application/json");
        PrintWriter out = response.getWriter();
        Gson gson = new Gson();
    
        try {
            BufferedReader reader = request.getReader();
            ToDo todo = gson.fromJson(reader, ToDo.class);
    
            if (todo == null || todo.id <= 0 || todo.title == null || todo.content == null ||
                todo.title.trim().isEmpty() || todo.content.trim().isEmpty()) {
    
                response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
                out.println("{\"status\": \"error\", \"message\": \"Invalid or missing ID, title, or content!\"}");
                return;
            }
    
            String updateQuery = "UPDATE todos SET title = ?, content = ? WHERE id = ?";
    
            try (Connection conn = DriverManager.getConnection(DB_URL, DB_USER, DB_PASSWORD);
                 PreparedStatement stmt = conn.prepareStatement(updateQuery)) {
    
                stmt.setString(1, todo.title);
                stmt.setString(2, todo.content);
                stmt.setInt(3, todo.id);
    
                int rowsUpdated = stmt.executeUpdate();
    
                if (rowsUpdated > 0) {
                    out.println("{\"status\": \"success\", \"message\": \"ToDo updated successfully!\"}");
                } else {
                    response.setStatus(HttpServletResponse.SC_NOT_FOUND);
                    out.println("{\"status\": \"error\", \"message\": \"ToDo with given ID not found!\"}");
                }
    
            } catch (SQLException e) {
                logger.severe("Database error: " + e.getMessage());
                response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
                out.println("{\"status\": \"error\", \"message\": \"Database error!\"}");
            }
    
        } catch (Exception e) {
            logger.severe("Unexpected error: " + e.getMessage());
            response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            out.println("{\"status\": \"error\", \"message\": \"Unexpected server error!\"}");
        }
    }    

    @Override
    protected void doDelete(HttpServletRequest request, HttpServletResponse response) throws IOException {

        response.setContentType("application/json");
        PrintWriter out = response.getWriter();
        Gson gson = new Gson();

        try {
            // Read JSON from request body
            BufferedReader reader = request.getReader();
            IdRequest idRequest = gson.fromJson(reader, IdRequest.class);

            if (idRequest == null || idRequest.id <= 0) {
                response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
                out.println("{\"status\": \"error\", \"message\": \"Invalid or missing ID in request body!\"}");
                return;
            }

            int id = idRequest.id;
            String deleteQuery = "DELETE FROM todos WHERE id = ?";

            try (Connection conn = DriverManager.getConnection(DB_URL, DB_USER, DB_PASSWORD);
                PreparedStatement stmt = conn.prepareStatement(deleteQuery)) {

                stmt.setInt(1, id);
                int rowsDeleted = stmt.executeUpdate();

                if (rowsDeleted > 0) {
                    out.println("{\"status\": \"success\", \"message\": \"ToDo deleted successfully!\"}");
                } else {
                    response.setStatus(HttpServletResponse.SC_NOT_FOUND);
                    out.println("{\"status\": \"error\", \"message\": \"ToDo with given ID not found!\"}");
                }

            } catch (SQLException e) {
                logger.severe("Database error: " + e.getMessage());
                response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
                out.println("{\"status\": \"error\", \"message\": \"Database error!\"}");
            }

        } catch (Exception e) {
            logger.severe("Unexpected error: " + e.getMessage());
            response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            out.println("{\"status\": \"error\", \"message\": \"Unexpected server error!\"}");
        }
    }


    @Override
    public void init() throws ServletException {
        super.init();
        try {
            // Load the JDBC driver (only needed for older versions, but good practice)
            Class.forName("com.mysql.cj.jdbc.Driver");
        } catch (ClassNotFoundException e) {
            logger.severe("MySQL JDBC Driver not found: " + e.getMessage());
            throw new ServletException("MySQL JDBC Driver not found", e);
        }
    }
}
