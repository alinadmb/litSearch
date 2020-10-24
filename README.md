# litSearch
## Введение
Наименование программы: LitSearch  
Назначение и область применения: рекомендательная система для поиска книг различных жанров
## Назначение и цели создания системы
Назначение разработки: рекомендательная система для поиска книг различных жанров (художественная литература, публицистика, психология, научная публицистика, история).  
Цели создания: предоставить пользователям возможность выбирать книги, подходящие под их интересы и предпочтения.
## Условия эксплуатации
Требования к квалификации и численности персонала:  
Количество пользователей ограничивается лишь вместительной способностью базы данных.   
Система доступна для всех пользователей, независимо от их квалификации.  
Пользователи могут создавать свой аккаунт, указывать личную информацию (имя, адрес электронной почты, пароль), редактировать ее, добавлять книги в “Избранное”, редактировать свое “Избранное”, просматривать “Избранное” других пользователей, просматривать свои “Рекомендации”, но не могут просматривать и редактировать личную информацию других пользователей, редактировать “Избранное” других пользователей.  
Пользователь добавляет понравившиеся ему книги в раздел «Избранное», на основе этого раздела формируются рекомендации книг для этого пользователя.
Таким образом, система предлагает пользователю книги, похожие на понравившиеся ему, то есть даёт рекомендации на основе его предпочтений.
## Требования к защите информации и программ
Требования к защите информации от несанкционированного доступа:  
Пользователи получают доступ к своему аккаунту только после введения правильного пароля. Возможно восстановления пароля с использованием электронной почты, указанной в аккаунте пользователя.  
Пользователи не могут просматривать и редактировать личную информацию других пользователей, редактировать “Избранное” других пользователей, просматривать “Рекомендации” других пользователей, редактировать свои “Рекомендации” и “Рекомендации” других пользователей.  

Требования к сохранности информации:  
Сохранность информации должна обеспечиваться при всех аварийных ситуациях.  
В случае возникновения аварии или сбоя в процессе выполнения пользовательских задач должно быть обеспечено восстановление базы данных до состояния на момент последней завершенной системой транзакции.  
Программное обеспечение компонентов системы должно автоматически восстанавливать свое функционирование при корректном перезапуске аппаратных средств.
## Требования к программной документации
Предварительный состав программной документации. Состав программной документации должен включать в себя:
- техническое задание;
- договор на разработку ПО;
- план-график и сроки выполнения работ;
- программа и методика испытаний.
## Разработка проекта системы базы данных
Требования к составу данных:  
Данные о книге должны содержать информацию о названии, об авторе, описание книги, год выпуска, жанр и рейтинг.  
Данные о пользователе должны содержать его имя, адрес электронной почты, пароль, “Избранное”, “Рекомендации”. (“Избранное” и “Рекомендации” содержат элементы из базы данных книг)  

Требования к представлению информации:  
Данные о книгах хранятся в таблице, содержащей поля “Название”, “Автор”, “Описание”, “Год выпуска”, “Жанр” и “Рейтинг”.  
Данные о пользователях хранятся в таблице, содержащей поля “Имя”, “Адрес электронной почты”, “Пароль”, “Избранное”, “Рекомендации”. Поля “Избранное” и “Рекомендации” содержат элементы из базы данных с книгами.  
Информация хранится в документе формата “csv”.  

Требования по применению СУБД :
- поддержка реляционной модели базы данных;
- импорт и экспорт данных;
- обеспечение безопасности данных на уровне сервера баз данных.
## Заполнение базы данных информацией
Требования к заполнению базы данных:  
База данных книг берется из открытого источника. Возможно добавление книг в базу данных разработчиком.  
База данных пользователей формируется в результате регистрации (указании личной информации) пользователей в системе.  
? Раздел "Рекомендации" в базе данных пользователей формируется с использованием модели рекомендательной системы:
- либо коллаборативной фильтрации, т.е. в рекомендации будут попадать книги, понравившиеся похожим пользователям (т.е. пользователям, у которых в "Избранном" есть определенное количество таких же книг, как и у данного человека);
- либо контентных рекомендаций, т.е. в рекомендации попадают книги с похожим содержанием (книги того же автора/жанра/года выпуска/рейтинга).

Предполагается использование методов машинного обучения для реализации данных рекомендательных моделей.  

Требования к источникам информации:  
Источниками информации служат открытый ресурс с базой данных книг и пользователи.  
Источники должны быть достоверными, надежными и актуальными.