<h1 align="center">CRUD-приложение для новостей с авторизацией через JWT-токены.</h1>

## Запуск проекта (установка зависимостей и запуск контейнеров Docker через Docker-Compose)

sh launch.sh

## Документация API находится в файле api_endpoints.xlsx

### Структура модуля

Состоит из 3 слоёв:

<ul>
<li>Контроллер для работы с сетью, в данном случае HTTP</li>
<li>Сервис для инкапсуляции бизнес-логики</li>
<li>Репозиторий для доступа к данным, в данном случае база данных PostgreSQL</li>
</ul>

Но также есть и дополнительные опциональые провайдеры для специфических нужд.

### Зависимости организованы согласно принципу Чистой Архитектуры (к примеру, интерфейс зависимости сервиса от репозитория хранится в сервисе)

### Сервис хранит свои таблицы в схеме PostgreSQL. Таблицы созданы через синхронизацию сущностей TypeORM.
