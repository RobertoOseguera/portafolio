<!-- dentro de tu modal -->
<?php if (isset($_GET['msg'])): ?>
  <div class="alert alert-<?php echo $_GET['type'] === 'success' ? 'success' : 'danger'; ?> alert-dismissible fade show" role="alert">
    <?php echo htmlspecialchars($_GET['msg']); ?>
    <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
  </div>
  <script>
    var loginModal = new bootstrap.Modal(document.getElementById('loginModal'));
    loginModal.show();
  </script>
<?php endif; ?>
