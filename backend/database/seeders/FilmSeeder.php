<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\{Film,Genre,Country,User,Rating};
use Illuminate\Support\Facades\DB;

class FilmSeeder extends Seeder
{
    public function run(): void
    {
        $genres = ['Драма','Комедия','Фантастика','Боевик','Мультфильм','Триллер','Фэнтези','Документальный'];
        $countries = ['США','Великобритания','Франция','Германия','Япония','Россия','Канада','Корея'];

        $genreIds = [];
        foreach ($genres as $name) {
            $genreIds[$name] = Genre::firstOrCreate(['name'=>$name])->id;
        }
        $countryIds = [];
        foreach ($countries as $name) {
            $countryIds[$name] = Country::firstOrCreate(['name'=>$name])->id;
        }

        $films = [
            ['title'=>'Побег из Шоушенка','year'=>1994,'duration_min'=>142,'director'=>'Фрэнк Дарабонт','description'=>'История надежды и дружбы.','is_18_plus'=>false,'genres'=>['Драма'],'countries'=>['США']],
            ['title'=>'Начало','year'=>2010,'duration_min'=>148,'director'=>'Кристофер Нолан','description'=>'Сон во сне.','is_18_plus'=>false,'genres'=>['Фантастика','Боевик'],'countries'=>['США','Великобритания']],
            ['title'=>'Город грехов','year'=>2005,'duration_min'=>124,'director'=>'Роберт Родригес','description'=>'Нуар-комикс.','is_18_plus'=>true,'genres'=>['Триллер'],'countries'=>['США']],
            ['title'=>'Престиж','year'=>2006,'duration_min'=>130,'director'=>'Кристофер Нолан','description'=>'Битва фокусников.','is_18_plus'=>false,'genres'=>['Драма','Триллер'],'countries'=>['США','Великобритания']],
            ['title'=>'Дюнкерк','year'=>2017,'duration_min'=>106,'director'=>'Кристофер Нолан','description'=>'Эвакуация союзников.','is_18_plus'=>false,'genres'=>['Боевик'],'countries'=>['Великобритания']],
            ['title'=>'Паразиты','year'=>2019,'duration_min'=>132,'director'=>'Пон Джун-хо','description'=>'Сатирическая драма.','is_18_plus'=>true,'genres'=>['Драма','Триллер'],'countries'=>['Корея']],
            ['title'=>'Ваш ход, король','year'=>2020,'duration_min'=>98,'director'=>'Артём Иванов','description'=>'Спортивная драма.','is_18_plus'=>false,'genres'=>['Драма'],'countries'=>['Россия']],
            ['title'=>'Blade Runner 2049','year'=>2017,'duration_min'=>164,'director'=>'Дени Вильнёв','description'=>'Киберпанк детектив.','is_18_plus'=>true,'genres'=>['Фантастика','Триллер'],'countries'=>['США','Канада']],
            ['title'=>'Душа','year'=>2020,'duration_min'=>100,'director'=>'Пит Доктер','description'=>'Путешествие души.','is_18_plus'=>false,'genres'=>['Мультфильм'],'countries'=>['США']],
            ['title'=>'Амели','year'=>2001,'duration_min'=>122,'director'=>'Жан-Пьер Жене','description'=>'Парижская сказка.','is_18_plus'=>false,'genres'=>['Комедия'],'countries'=>['Франция']],
            ['title'=>'Интерстеллар','year'=>2014,'duration_min'=>169,'director'=>'Кристофер Нолан','description'=>'Космическое путешествие за пределы галактики.','is_18_plus'=>false,'genres'=>['Фантастика','Драма'],'countries'=>['США']],
            ['title'=>'Матрица','year'=>1999,'duration_min'=>136,'director'=>'Лана и Лилли Вачовски','description'=>'Революция машин.','is_18_plus'=>true,'genres'=>['Фантастика','Боевик'],'countries'=>['США']],
            ['title'=>'Олдбой','year'=>2003,'duration_min'=>120,'director'=>'Пак Чхан-ук','description'=>'История мести.','is_18_plus'=>true,'genres'=>['Триллер'],'countries'=>['Корея']],
            ['title'=>'1+1','year'=>2011,'duration_min'=>112,'director'=>'Оливье Накаш','description'=>'Невероятная дружба.','is_18_plus'=>false,'genres'=>['Драма','Комедия'],'countries'=>['Франция']],
            ['title'=>'Темный рыцарь','year'=>2008,'duration_min'=>152,'director'=>'Кристофер Нолан','description'=>'Бэтмен против Джокера.','is_18_plus'=>false,'genres'=>['Боевик'],'countries'=>['США']],
            ['title'=>'Зеленая книга','year'=>2018,'duration_min'=>130,'director'=>'Питер Фаррелли','description'=>'Дружба в турне.','is_18_plus'=>false,'genres'=>['Драма'],'countries'=>['США']],
            ['title'=>'Пила','year'=>2004,'duration_min'=>103,'director'=>'Джеймс Ван','description'=>'Игра на выживание.','is_18_plus'=>true,'genres'=>['Триллер'],'countries'=>['США']],
            ['title'=>'Выживший','year'=>2015,'duration_min'=>156,'director'=>'Алехандро Гонсалес Иньярриту','description'=>'История выживания.','is_18_plus'=>true,'genres'=>['Драма'],'countries'=>['США','Канада']],
            ['title'=>'Гарри Поттер и узник Азкабана','year'=>2004,'duration_min'=>142,'director'=>'Альфонсо Куарон','description'=>'Приключения волшебников.','is_18_plus'=>false,'genres'=>['Фэнтези'],'countries'=>['Великобритания']],
            ['title'=>'Ла-Ла Ленд','year'=>2016,'duration_min'=>128,'director'=>'Дэмиен Шазелл','description'=>'Мюзикл о мечте.','is_18_plus'=>false,'genres'=>['Драма','Комедия'],'countries'=>['США']],
        ];

        $users = User::all();
        foreach ($films as $data) {
            $film = Film::updateOrCreate(
                ['title'=>$data['title'],'year'=>$data['year']],
                [
                    'duration_min'=>$data['duration_min'],
                    'director'=>$data['director'],
                    'description'=>$data['description'],
                    'is_18_plus'=>$data['is_18_plus'],
                    'status'=>'published'
                ]
            );
            $film->genres()->sync(array_map(fn($g)=>$genreIds[$g], $data['genres']));
            $film->countries()->sync(array_map(fn($c)=>$countryIds[$c], $data['countries']));

            foreach ($users as $user) {
                if (rand(0,1)) {
                    Rating::updateOrCreate(
                        ['user_id'=>$user->id,'film_id'=>$film->id],
                        ['rating'=>rand(6,10)]
                    );
                }
                if ($user->login === 'demo') {
                    DB::table('favorites')->updateOrInsert(['user_id'=>$user->id,'film_id'=>$film->id]);
                    if ($film->is_18_plus === false && rand(0,1)) {
                        DB::table('watch_later')->updateOrInsert(['user_id'=>$user->id,'film_id'=>$film->id]);
                    }
                    if (rand(0,1)) {
                        DB::table('watched')->updateOrInsert(['user_id'=>$user->id,'film_id'=>$film->id], ['watched_at'=>now()]);
                    }
                }
            }
        }
    }
}
