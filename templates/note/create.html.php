<?php $router = $router ?? new \App\Service\Router(); ?>
<h1>Utwórz notatkę</h1>
<form action="<?= $router->generatePath('note-create') ?>" method="post">
    <label>Tytuł: <input type="text" name="title" required></label><br>
    <label>Treść: <textarea name="body" required></textarea></label><br>
    <input type="submit" value="Zapisz">
</form>