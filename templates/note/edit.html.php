<?php $router = $router ?? new \App\Service\Router(); ?>
<h1>Edytuj notatkę</h1>
<form action="<?= $router->generatePath('note-edit') ?>?id=<?= $note->getId() ?>" method="post">
    <label>Tytuł: <input type="text" name="title" value="<?= $note->getTitle() ?>"></label><br>
    <label>Treść: <textarea name="body"><?= $note->getBody() ?></textarea></label><br>
    <input type="submit" value="Zaktualizuj">
</form>