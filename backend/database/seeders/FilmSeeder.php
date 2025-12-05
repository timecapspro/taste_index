<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\{Film,Genre,Country,User,Rating};

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
            }
        }
    }
}
