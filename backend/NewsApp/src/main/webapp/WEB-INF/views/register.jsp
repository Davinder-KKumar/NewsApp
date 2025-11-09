<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>User Registration | NewsApp</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
    <style>
        .background { background-color: #343a40; }
        .card-custom { max-width: 450px; margin: 50px auto; border: 1px solid #ddd; }
    </style>
</head>
<body>
    <div class="container">
        <div class="card card-custom shadow">
            <div class="card-header background text-light text-center">
                <h3>Register for NewsApp</h3>
            </div>
            <div class="card-body">
                <%-- Display message/error if passed from the controller --%>
                <% 
                    String message = request.getParameter("message");
                    String alertClass = request.getParameter("success") != null ? "alert-success" : "alert-danger";
                    if (message != null) { 
                %>
                    <div class="alert <%= alertClass %>" role="alert">
                        <%= message %>
                    </div>
                <% } %>
                
                <form action="/api/auth/register" method="POST">
                    <div class="mb-3">
                        <label for="name" class="form-label">Full Name</label>
                        <input type="text" class="form-control" id="name" name="name" required>
                    </div>
                    <div class="mb-3">
                        <label for="email" class="form-label">Email address</label>
                        <input type="email" class="form-control" id="email" name="email" required>
                    </div>
                    <div class="mb-3">
                        <label for="password" class="form-label">Password</label>
                        <input type="password" class="form-control" id="password" name="password" required>
                    </div>
                    <button type="submit" class="btn btn-success w-100 mt-3">Register</button>
                </form>
            </div>
            <div class="card-footer text-center">
                <p class="mb-0">Already have an account? <a href="/login">Login here</a></p>
            </div>
        </div>
    </div>
</body>
</html>