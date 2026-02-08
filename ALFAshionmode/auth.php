<?php
$conexion = new mysqli("localhost", "root", "", "alfashionmode");
if ($conexion->connect_error) {
    die("Error de conexión: " . $conexion->connect_error);
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    header("Location: index.php?msg=Método+no+permitido&type=error");
    exit;
}

$username = $_POST['username'] ?? '';
$email = $_POST['email'] ?? '';
$password = $_POST['password'] ?? '';
$action = $_POST['action'] ?? '';

if ($action === "register") {
    $password_hash = password_hash($password, PASSWORD_BCRYPT);
    $sql = "INSERT INTO users (username, email, password_hash) VALUES (?, ?, ?)";
    $stmt = $conexion->prepare($sql);
    $stmt->bind_param("sss", $username, $email, $password_hash);
    if ($stmt->execute()) {
        header("Location: index.php?msg=Usuario+registrado+con+éxito&type=success");
    } else {
        header("Location: index.php?msg=Error+al+registrar&type=error");
    }
    exit;
} elseif ($action === "login") {
    $sql = "SELECT username, password_hash FROM users WHERE email = ?";
    $stmt = $conexion->prepare($sql);
    $stmt->bind_param("s", $email);
    $stmt->execute();
    $stmt->bind_result($db_username, $hash_guardado);
    if ($stmt->fetch() && password_verify($password, $hash_guardado)) {
        header("Location: index.php?msg=Login+exitoso.+Bienvenido,+$db_username&type=success");
    } else {
        header("Location: index.php?msg=Credenciales+incorrectas&type=error");
    }
    exit;
} else {
    header("Location: index.php?msg=Acción+no+válida&type=error");
    exit;
}

$conexion->close();
?>
