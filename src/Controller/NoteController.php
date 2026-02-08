<?php

namespace App\Controller;

use App\Model\Note;
use App\Service\Router;
use App\Service\Templating;

class NoteController
{
    public function indexAction(?array $requestData, Templating $templating, Router $router): ?string
    {
        $notes = Note::findAll();

        return $templating->render('note/index.html.php', [
            'notes' => $notes,
            'router' => $router
        ]);
    }

    public function createAction(?array $requestData, Templating $templating, Router $router): ?string
    {
        if ($_SERVER['REQUEST_METHOD'] === 'POST') {
            $note = Note::fromArray($_POST);
            $note->save();
            $router->redirect($router->generatePath('note-index'));
            return null;
        }

        return $templating->render('note/create.html.php', [
            'router' => $router,
        ]);
    }

    public function editAction(?array $requestData, Templating $templating, Router $router): ?string
    {
        $id = $_REQUEST['id'] ?? null;
        if (! $id) {
            $router->redirect($router->generatePath('note-index'));
            return null;
        }

        $note = Note::find($id);
        if (! $note) {
            $router->redirect($router->generatePath('note-index'));
            return null;
        }

        if ($_SERVER['REQUEST_METHOD'] === 'POST') {
            $note->fill($_POST);
            $note->save();

            $router->redirect($router->generatePath('note-index'));
            return null;
        }

        return $templating->render('note/edit.html.php', [
            'note' => $note,
            'router' => $router,
        ]);
    }

    public function showAction(?array $requestData, Templating $templating, Router $router): ?string
    {
        $id = $_REQUEST['id'] ?? null;
        $note = Note::find($id);

        if (! $note) {
            $router->redirect($router->generatePath('note-index'));
            return null;
        }

        return $templating->render('note/show.html.php', [
            'note' => $note,
            'router' => $router,
        ]);
    }

    public function deleteAction(?array $requestData, Templating $templating, Router $router): ?string
    {
        $id = $_REQUEST['id'] ?? null;
        $note = Note::find($id);

        if ($note) {
            $note->delete();
        }

        $router->redirect($router->generatePath('note-index'));
        return null;
    }
}