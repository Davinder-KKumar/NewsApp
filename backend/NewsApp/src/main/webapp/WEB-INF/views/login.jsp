<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>User Login | NewsApp</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
    <style>
        .background { background-color: #343a40; } /* Matches Navbar background */
        .card-custom { max-width: 450px; margin: 50px auto; border: 1px solid #ddd; }
    </style>
</head>
<body>
    <div class="container">
        <div class="card card-custom shadow">
            <div class="card-header background text-light text-center">
                <h3>Login to NewsApp</h3>
            </div>
            <div class="card-body">
                <%-- Display error message if passed from the controller (e.g., failed login) --%>
                <% 
                    String error = request.getParameter("error");
                    if (error != null) { 
                %>
                    <div class="alert alert-danger" role="alert">
                        <%= error %>
                    </div>
                <% } %>
                
                <%-- Display success message if passed from the controller (e.g., successful registration) --%>
                <% 
                    String message = request.getParameter("message");
                    if (message != null) { 
                %>
                    <div class="alert alert-success" role="alert">
                        <%= message %>
                    </div>
                <% } %>

                <form action="/api/auth/login" method="POST">
                    <div class="mb-3">
                        <label for="email" class="form-label">Email address</label>
                        <input type="email" class="form-control" id="email" name="email" required>
                    </div>
                    <div class="mb-3">
                        <label for="password" class="form-label">Password</label>
                        <input type="password" class="form-control" id="password" name="password" required>
                    </div>
                    <button type="submit" class="btn btn-primary background w-100 mt-3">Login</button>
                </form>
            </div>
            <div class="card-footer text-center">
                <p class="mb-0">New user? <a href="/register">Register here</a></p>
            </div>
        </div>
    </div>
</body>
</html>