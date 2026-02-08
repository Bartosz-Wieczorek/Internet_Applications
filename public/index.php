<?php
require_once __DIR__ . DIRECTORY_SEPARATOR . '..' . DIRECTORY_SEPARATOR . 'autoload.php';

$config = new \App\Service\Config();

$templating = new \App\Service\Templating();
$router = new \App\Service\Router();

$action = $_REQUEST['action'] ?? null;
switch ($action) {
    // --- SEKCJA POST ---
    case 'post-index':
    case null: // Domyślna strona to lista postów
        $controller = new \App\Controller\PostController();
        $view = $controller->indexAction($templating, $router);
        break;
    case 'post-create':
        $controller = new \App\Controller\PostController();
        $view = $controller->createAction($_REQUEST['post'] ?? null, $templating, $router);
        break;
    case 'post-edit':
        if (! $_REQUEST['id']) {
            break;
        }
        $controller = new \App\Controller\PostController();
        $view = $controller->editAction($_REQUEST['id'], $_REQUEST['post'] ?? null, $templating, $router);
        break;
    case 'post-show':
        if (! $_REQUEST['id']) {
            break;
        }
        $controller = new \App\Controller\PostController();
        $view = $controller->showAction($_REQUEST['id'], $templating, $router);
        break;
    case 'post-delete':
        if (! $_REQUEST['id']) {
            break;
        }
        $controller = new \App\Controller\PostController();
        $view = $controller->deleteAction($_REQUEST['id'], $router);
        break;

    // --- SEKCJA NOTE (NOWA) ---
    case 'note-index':
        $controller = new \App\Controller\NoteController();
        // Przekazujemy $_REQUEST, bo tak zdefiniowaliśmy NoteController w poprzednim kroku
        $view = $controller->indexAction($_REQUEST, $templating, $router);
        break;
    case 'note-create':
        $controller = new \App\Controller\NoteController();
        $view = $controller->createAction($_REQUEST, $templating, $router);
        break;
    case 'note-edit':
        $controller = new \App\Controller\NoteController();
        $view = $controller->editAction($_REQUEST, $templating, $router);
        break;
    case 'note-show':
        $controller = new \App\Controller\NoteController();
        $view = $controller->showAction($_REQUEST, $templating, $router);
        break;
    case 'note-delete':
        $controller = new \App\Controller\NoteController();
        $view = $controller->deleteAction($_REQUEST, $templating, $router);
        break;

    // --- INNE ---
    case 'info':
        $controller = new \App\Controller\InfoController();
        $view = $controller->infoAction();
        break;
    default:
        $view = 'Not found';
        break;
}

if ($view) {
    echo $view;
}