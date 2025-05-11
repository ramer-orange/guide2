<?php

namespace Tests\Feature;

use App\Models\Plan;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;
use PHPUnit\Framework\Attributes\Test;

class PlanControllerTest extends TestCase
{
    use RefreshDatabase;

    protected $user;
    protected $otherUser;

    protected function setUp(): void
    {
        parent::setUp();

        // テスト用ユーザーの作成
        $this->user = User::factory()->create();
        $this->otherUser = User::factory()->create();
    }

    #[\PHPUnit\Framework\Attributes\Test]
    public function 認証されていないユーザーはプランにアクセスできない()
    {
        $response = $this->getJson('/api/plans');
        $response->assertStatus(401);
    }

    #[Test]
    public function 認証済みユーザーは自分のプラン一覧を取得できる()
    {
        // 認証
        Sanctum::actingAs($this->user);

        // 自分のプランと他人のプランを作成
        $myPlans = Plan::factory()->count(3)->create(['user_id' => $this->user->id]);
        Plan::factory()->count(2)->create(['user_id' => $this->otherUser->id]);

        $response = $this->getJson('/api/plans');

        $response->assertStatus(200)
                 ->assertJsonCount(3)
                 ->assertJson($myPlans->map(function ($plan) {
                     return [
                         'id' => $plan->id,
                         'title' => $plan->title,
                         'user_id' => $this->user->id,
                     ];
                 })->toArray());
    }

    #[Test]
    public function 認証済みユーザーは自分のプランを詳細表示できる()
    {
        Sanctum::actingAs($this->user);

        $plan = Plan::factory()->create(['user_id' => $this->user->id]);

        $response = $this->getJson("/api/plans/{$plan->id}");

        $response->assertStatus(200)
                 ->assertJson([
                     'id' => $plan->id,
                     'title' => $plan->title,
                     'user_id' => $this->user->id,
                 ]);
    }

    #[Test]
    public function 認証済みユーザーは他人のプランを詳細表示できない()
    {
        Sanctum::actingAs($this->user);

        $otherPlan = Plan::factory()->create(['user_id' => $this->otherUser->id]);

        $response = $this->getJson("/api/plans/{$otherPlan->id}");

        $response->assertStatus(404);
    }

    #[Test]
    public function 認証済みユーザーはプランを作成できる()
    {
        Sanctum::actingAs($this->user);

        $planData = [
            'title' => '東京旅行',
            'start_date' => '2025-07-01',
            'end_date' => '2025-07-05',
        ];

        $response = $this->postJson('/api/plans', $planData);

        $response->assertStatus(201)
                 ->assertJson([
                     'title' => '東京旅行',
                     'start_date' => '2025-07-01',
                     'end_date' => '2025-07-05',
                     'user_id' => $this->user->id,
                 ]);

        $this->assertDatabaseHas('plans', [
            'title' => '東京旅行',
            'user_id' => $this->user->id,
        ]);
    }

    #[Test]
    public function 認証済みユーザーは自分のプランを更新できる()
    {
        Sanctum::actingAs($this->user);

        $plan = Plan::factory()->create(['user_id' => $this->user->id]);
        $updateData = [
            'title' => '更新されたタイトル',
            'start_date' => '2025-08-01',
        ];

        $response = $this->putJson("/api/plans/{$plan->id}", $updateData);

        $response->assertStatus(200)
                 ->assertJson([
                     'id' => $plan->id,
                     'title' => '更新されたタイトル',
                     'start_date' => '2025-08-01',
                 ]);

        $this->assertDatabaseHas('plans', [
            'id' => $plan->id,
            'title' => '更新されたタイトル',
        ]);
    }

    #[Test]
    public function 認証済みユーザーは他人のプランを更新できない()
    {
        Sanctum::actingAs($this->user);

        $otherPlan = Plan::factory()->create(['user_id' => $this->otherUser->id]);
        $updateData = ['title' => '不正な更新'];

        $response = $this->putJson("/api/plans/{$otherPlan->id}", $updateData);

        $response->assertStatus(404);
    }

    #[Test]
    public function 認証済みユーザーは自分のプランを削除できる()
    {
        Sanctum::actingAs($this->user);

        $plan = Plan::factory()->create(['user_id' => $this->user->id]);

        $response = $this->deleteJson("/api/plans/{$plan->id}");

        $response->assertStatus(200)
                 ->assertJson(['message' => 'Plan deleted successfully.']);

        $this->assertDatabaseMissing('plans', ['id' => $plan->id]);
    }

    #[Test]
    public function 認証済みユーザーは他人のプランを削除できない()
    {
        Sanctum::actingAs($this->user);

        $otherPlan = Plan::factory()->create(['user_id' => $this->otherUser->id]);

        $response = $this->deleteJson("/api/plans/{$otherPlan->id}");

        $response->assertStatus(404);

        $this->assertDatabaseHas('plans', ['id' => $otherPlan->id]);
    }

    #[Test]
    public function プラン作成時のバリデーションテスト()
    {
        Sanctum::actingAs($this->user);

        // 空データでテスト
        $response = $this->postJson('/api/plans', []);
        $response->assertStatus(422);

        // 不正な日付形式でテスト
        $response = $this->postJson('/api/plans', [
            'title' => 'テスト旅行',
            'start_date' => '無効な日付',
            'end_date' => '2025-07-01',
        ]);
        $response->assertStatus(422);

        // 終了日が開始日より前のテスト
        $response = $this->postJson('/api/plans', [
            'title' => 'テスト旅行',
            'start_date' => '2025-07-10',
            'end_date' => '2025-07-05',
        ]);
        $response->assertStatus(422);
    }
}
