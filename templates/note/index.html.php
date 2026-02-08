<?php
/** @var \App\Model\Note[] $notes */
/** @var \App\Service\Router $router */

$title = 'Lista Notatek';
$bodyClass = 'index';

ob_start(); ?>

    <div class="header-actions">
        <h1>Lista Notatek</h1>
        <a href="<?= $router->generatePath('note-create') ?>" class="btn-create">Utwórz nową</a>
    </div>

    <ul class="index-list">
        <?php foreach ($notes as $note): ?>
            <li>
                <span class="item-title"><?= htmlspecialchars($note->getTitle()) ?></span>
                <ul class="action-list">
                    <li><a href="<?= $router->generatePath('note-show') ?>&id=<?= $note->getId() ?>">Szczegóły</a></li>
                    <li><a href="<?= $router->generatePath('note-edit') ?>&id=<?= $note->getId() ?>">Edytuj</a></li>
                    <li>
                        <form action="<?= $router->generatePath('note-delete') ?>" method="post" onsubmit="return confirm('Czy na pewno?')">
                            <input type="hidden" name="id" value="<?= $note->getId() ?>">
                            <input type="submit" value="Usuń" class="btn-link">
                        </form>
                    </li>
                </ul>
            </li>
        <?php endforeach; ?>
    </ul>

<?php $main = ob_get_clean(); ?>
<?php include __DIR__ . DIRECTORY_SEPARATOR . '..' . DIRECTORY_SEPARATOR . 'base.html.php'; ?>