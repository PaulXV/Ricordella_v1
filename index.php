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
                $conn->close();
                $url = "Location: notes/index.html?userID=".$row['ID'];
                header($url);
                break;
            }
        }
        echo "<p style='text-align: center; color:red;'>Credenziali errate.</p>";
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

    <style>
        body{
            margin: 0;
            padding: 0;
            user-select: none;
            background-image: url('./login.jpg');
            background-repeat: no-repeat;
            background-size: cover;"
        }
    </style>
</head>
<body>

<section class="vh-100">
    <div class="container py-5 h-100">
        <div class="row d-flex justify-content-center align-items-center h-100">
            <div class="col-12 col-md-8 col-lg-6 col-xl-5">
                <div class="card shadow-2-strong" style="border-radius: 1rem;">
                    <div class="card-body p-5 text-center">
                        <form method="post" action="<?php echo htmlspecialchars($_SERVER["PHP_SELF"]); ?>">
                            <h3 class="mb-4">Login</h3>
                            
                            <div class="input-group mb-3">
                                <span class="input-group-text" id="basic-addon1">@</span>
                                <input type="text" name="username" class="form-control" placeholder="Username" aria-label="Username" aria-describedby="basic-addon1" value="" autocomplete="off">
                            </div>
                            <div class="password-group mb-4">
                                <label for="exampleInputPassword1" class="form-label">Password:</label>
                                <input type="password" name="password" class="form-control" id="exampleInputPassword1" value="" autocomplete="off">
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

<div class="position-fixed top-0 end-0 p-3" style="z-index: 11">
    <div id="liveToast" class="toast" role="alert" aria-live="assertive" aria-atomic="true">
        <div class="toast-header">
            <strong class="me-auto">Piccola tip per te!</strong>
            <small>Ora!</small>
            <button type="button" class="btn-close" data-bs-dismiss="toast" aria-label="Close"></button>
        </div>
        <div class="toast-body">
            Per provare la nostra app loggati con demo/demo
        </div>
    </div>
</div>

<script>
    window.addEventListener('load', function() {
        let toastElList = [].slice.call(document.querySelectorAll('.toast'))
        let toastList = toastElList.map(function (toastEl) {
            return new bootstrap.Toast(toastEl);
        })
        toastList.forEach(toast => toast.show())
    });
</script>

<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.2.3/dist/js/bootstrap.bundle.min.js" integrity="sha384-kenU1KFdBIe4zVF0s0G1M5b4hcpxyD9F7jL+jjXkk+Q2h455rYXK/7HAuoJl+0I4" crossorigin="anonymous"></script>
</body>
</html>