<?php
namespace App\Model;

use App\Service\Config;

class Note
{
    private ?int $id = null;
    private ?string $title = null;
    private ?string $body = null;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function setId(?int $id): Note
    {
        $this->id = $id;
        return $this;
    }

    public function getTitle(): ?string
    {
        return $this->title;
    }

    public function setTitle(?string $title): Note
    {
        $this->title = $title;
        return $this;
    }

    public function getBody(): ?string
    {
        return $this->body;
    }

    public function setBody(?string $body): Note
    {
        $this->body = $body;
        return $this;
    }

    public static function fromArray($array): Note
    {
        $note = new self();
        $note->fill($array);
        return $note;
    }

    public function fill($array): Note
    {
        if (isset($array['id']) && ! $this->getId()) {
            $this->setId($array['id']);
        }
        if (isset($array['title'])) {
            $this->setTitle($array['title']);
        }
        if (isset($array['body'])) {
            $this->setBody($array['body']);
        }
        return $this;
    }

    public static function findAll(): array
    {
        // POPRAWKA: Wskazujemy bezwzględną ścieżkę do pliku data1.db
        $path = dirname(__DIR__, 2) . '/data1.db';
        $pdo = new \PDO('sqlite:' . $path);

        $sql = 'SELECT * FROM note';
        $statement = $pdo->prepare($sql);
        $statement->execute();

        $notes = [];
        $notesArray = $statement->fetchAll(\PDO::FETCH_ASSOC);
        foreach ($notesArray as $noteArray) {
            $notes[] = self::fromArray($noteArray);
        }

        return $notes;
    }

    public static function find($id): ?Note
    {
        // POPRAWKA
        $path = dirname(__DIR__, 2) . '/data1.db';
        $pdo = new \PDO('sqlite:' . $path);

        $sql = 'SELECT * FROM note WHERE id = :id';
        $statement = $pdo->prepare($sql);
        $statement->execute(['id' => $id]);

        $noteArray = $statement->fetch(\PDO::FETCH_ASSOC);
        if (! $noteArray) {
            return null;
        }
        $note = Note::fromArray($noteArray);

        return $note;
    }

    public function save(): void
    {
        // POPRAWKA
        $path = dirname(__DIR__, 2) . '/data1.db';
        $pdo = new \PDO('sqlite:' . $path);

        if (! $this->getId()) {
            $sql = "INSERT INTO note (title, body) VALUES (:title, :body)";
            $statement = $pdo->prepare($sql);
            $statement->execute([
                'title' => $this->getTitle(),
                'body' => $this->getBody(),
            ]);

            $this->setId($pdo->lastInsertId());
        } else {
            $sql = "UPDATE note SET title = :title, body = :body WHERE id = :id";
            $statement = $pdo->prepare($sql);
            $statement->execute([
                ':title' => $this->getTitle(),
                ':body' => $this->getBody(),
                ':id' => $this->getId(),
            ]);
        }
    }

    public function delete(): void
    {
        // POPRAWKA
        $path = dirname(__DIR__, 2) . '/data1.db';
        $pdo = new \PDO('sqlite:' . $path);

        $sql = "DELETE FROM note WHERE id = :id";
        $statement = $pdo->prepare($sql);
        $statement->execute([
            ':id' => $this->getId(),
        ]);

        $this->setId(null);
        $this->setTitle(null);
        $this->setBody(null);
    }
}