<?php
include 'scripts/connessione.php';

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $username = mysqli_real_escape_string($conn, $_POST['username']);
    $password = $_POST['password'];

    $sql = "SELECT * FROM users";
    $result = $conn->query($sql);

    if ($result->num_rows > 0){
        while ($row = $result->fetch_assoc()) {
            if($row['username'] == $username && password_verify($password, $row['password'])){
                echo "Accesso riuscito!";
                $url = "Location: notes/index.html?userID=".$row['ID'];
                header($url);
                exit();
            }else {
                echo "<p style='text-align: center; color:red;'>Credenziali errate.</p>";
            }
        }
    }
}
$conn->close();
?>

<!DOCTYPE html>
<html lang="it" >
<head>
    <meta charset="UTF-8">
    <title>Le tue note - Login</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.2.3/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-rbsA2VBKQhggwzxH7pPCaAqO46MgnOM80zW1RWuH61DGLwZJEdK2Kadq2F9CUG65" crossorigin="anonymous">
</head>
<body>

<section class="vh-100" style="background: linear-gradient(to left, #BBDEF0, #F2C078);">
    <div class="container py-5 h-100">
        <div class="row d-flex justify-content-center align-items-center h-100">
            <div class="col-12 col-md-8 col-lg-6 col-xl-5">
                <div class="card shadow-2-strong" style="border-radius: 1rem;">
                    <div class="card-body p-5 text-center">
                        <form method="post" action="<?php echo htmlspecialchars($_SERVER["PHP_SELF"]); ?>">
                            <h3 class="mb-5">Login</h3>
                            
                            <div class="input-group mb-3">
                                <span class="input-group-text" id="basic-addon1">@</span>
                                <input type="text" name="username" class="form-control" placeholder="Username" aria-label="Username" aria-describedby="basic-addon1" value="">
                            </div>
                            <div class="mb-3">

                                <label for="exampleInputPassword1" class="form-label">Password:</label>
                                <input type="password" name="password" class="form-control" id="exampleInputPassword1" value="">
                            </div>

                            <button type="submit" class="btn btn-primary">Accedi</button>
                            <a class="btn btn-outline-secondary" href="scripts/register.php">Registrati</a>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    </div>
</section>

<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.2.3/dist/js/bootstrap.bundle.min.js" integrity="sha384-kenU1KFdBIe4zVF0s0G1M5b4hcpxyD9F7jL+jjXkk+Q2h455rYXK/7HAuoJl+0I4" crossorigin="anonymous"></script>
</body>
</html>