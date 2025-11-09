<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use App\Models\User;

class UsersSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $users = [
            [
                'name' => 'Admin',
                'email' => 'admin@medassist.com',
                'password' => Hash::make('admin123'),
                'role' => User::ADMIN_ROLE,
            ],  
            [
                'name' => 'Doctor',
                'email' => 'doctor@medassist.com',
                'password' => Hash::make('doctor123'),
                'role' => User::DOCTOR_ROLE,
            ],
            [
                'name' => 'Nurse',
                'email' => 'nurse@medassist.com',
                'password' => Hash::make('nurse123'),
                'role' => User::NURSE_ROLE,
            ],
        ];
        foreach ($users as $user) {
            User::create($user);
        }
    }
}
