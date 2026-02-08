<?php
/** @var \App\Model\Note $note */
/** @var \App\Service\Router $router */

$title = 'Szczegóły notatki';
$bodyClass = 'show';

ob_start(); ?>

    <h1><?= htmlspecialchars($note->getTitle()) ?></h1>

    <div class="note-content" style="background: white; padding: 20px; border: 1px solid #ddd; margin: 20px 0; border-radius: 5px;">
        <p><strong>Treść:</strong></p>
        <?= nl2br(htmlspecialchars($note->getBody() ?? '')) ?>
    </div>

    <div class="actions">
        <a href="<?= $router->generatePath('note-index') ?>">Powrót do listy</a> |
        <a href="<?= $router->generatePath('note-edit') ?>&id=<?= $note->getId() ?>">Edytuj</a>
    </div>

<?php $main = ob_get_clean(); ?>
<?php include __DIR__ . DIRECTORY_SEPARATOR . '..' . DIRECTORY_SEPARATOR . 'base.html.php'; ?>