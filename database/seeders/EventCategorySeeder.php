<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class EventCategorySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {

        $categories = [
            ['name' => 'Music & Concerts'],
            ['name' => 'Conferences'],
            ['name' => 'Workshops'],
            ['name' => 'Networking'],
            ['name' => 'Sports'],
            ['name' => 'Arts & Culture'],
            ['name' => 'Food & Drink'],
            ['name' => 'Technology'],
            ['name' => 'Charity'],
            ['name' => 'Other'],
        ];

        foreach ($categories as $category) {
            \App\Models\EventCategory::updateOrCreate(
                ['slug' => Str::slug($category['name'])],
                ['name' => $category['name']]
            );
        }
    }
}
