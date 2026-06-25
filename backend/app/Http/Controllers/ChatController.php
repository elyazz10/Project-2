<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Chat;
use App\Helpers\JWTHelper;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Validator;

class ChatController extends Controller
{
    private function getAuthUser(Request $request): ?User
    {
        $token = $request->bearerToken();
        if (!$token) {
            return null;
        }

        $payload = JWTHelper::decode($token);
        if (!$payload || !isset($payload['sub'])) {
            return null;
        }

        return User::find($payload['sub']);
    }

    private function verifyAdmin(Request $request): ?User
    {
        $token = $request->bearerToken();
        if (!$token) {
            return null;
        }

        $payload = JWTHelper::decode($token);
        if (!$payload || !isset($payload['sub'])) {
            return null;
        }

        $user = User::find($payload['sub']);
        if (!$user || $user->role !== 'admin') {
            return null;
        }

        return $user;
    }

    // --- MEMBER ENDPOINTS ---

    public function getMemberMessages(Request $request): JsonResponse
    {
        $user = $this->getAuthUser($request);
        if (!$user) {
            return response()->json(['success' => false, 'message' => 'Unauthorized'], 401);
        }

        // Get all messages where sender is this member or receiver is this member
        $messages = Chat::where('sender_id', $user->id)
            ->orWhere('receiver_id', $user->id)
            ->orderBy('created_at', 'asc')
            ->get();

        // Mark messages from admin/owner to this user as read
        Chat::where('receiver_id', $user->id)
            ->where('is_read', false)
            ->update(['is_read' => true]);

        return response()->json([
            'success' => true,
            'messages' => $messages
        ]);
    }

    public function sendMemberMessage(Request $request): JsonResponse
    {
        $user = $this->getAuthUser($request);
        if (!$user) {
            return response()->json(['success' => false, 'message' => 'Unauthorized'], 401);
        }

        $validator = Validator::make($request->all(), [
            'message' => 'required|string|max:5000'
        ]);

        if ($validator->fails()) {
            return response()->json(['success' => false, 'errors' => $validator->errors()], 422);
        }

        $chat = Chat::create([
            'sender_id' => $user->id,
            'receiver_id' => null, // null means broadcast/sent to admin group
            'message' => $request->message,
            'is_read' => false
        ]);

        return response()->json([
            'success' => true,
            'message' => $chat
        ], 201);
    }

    // --- ADMIN / OWNER ENDPOINTS ---

    public function getAdminConversations(Request $request): JsonResponse
    {
        $admin = $this->verifyAdmin($request);
        if (!$admin) {
            return response()->json(['success' => false, 'message' => 'Unauthorized'], 401);
        }

        // Fetch distinct user IDs that have chats
        $senderIds = Chat::select('sender_id')->distinct()->pluck('sender_id')->toArray();
        $receiverIds = Chat::select('receiver_id')->whereNotNull('receiver_id')->distinct()->pluck('receiver_id')->toArray();
        $userIds = array_unique(array_merge($senderIds, $receiverIds));

        // Get members only (non admin/owner roles)
        $members = User::whereIn('id', $userIds)
            ->whereNotIn('role', ['admin', 'owner'])
            ->get();

        $conversations = [];

        foreach ($members as $member) {
            $lastMsg = Chat::where(function($q) use ($member) {
                $q->where('sender_id', $member->id)
                  ->orWhere('receiver_id', $member->id);
            })->orderBy('created_at', 'desc')->first();

            $unreadCount = Chat::where('sender_id', $member->id)
                ->whereNull('receiver_id')
                ->where('is_read', false)
                ->count();

            $conversations[] = [
                'user' => [
                    'id' => $member->id,
                    'name' => $member->name,
                    'email' => $member->email,
                    'whatsapp' => $member->whatsapp
                ],
                'last_message' => $lastMsg,
                'unread_count' => $unreadCount
            ];
        }

        // Sort conversations by the latest message time desc
        usort($conversations, function($a, $b) {
            $t1 = $a['last_message'] ? strtotime($a['last_message']->created_at) : 0;
            $t2 = $b['last_message'] ? strtotime($b['last_message']->created_at) : 0;
            return $t2 - $t1;
        });

        return response()->json([
            'success' => true,
            'conversations' => $conversations
        ]);
    }

    public function getAdminMessages(Request $request, $userId): JsonResponse
    {
        $admin = $this->verifyAdmin($request);
        if (!$admin) {
            return response()->json(['success' => false, 'message' => 'Unauthorized'], 401);
        }

        $messages = Chat::where('sender_id', $userId)
            ->orWhere('receiver_id', $userId)
            ->orderBy('created_at', 'asc')
            ->get();

        // Mark member's messages as read by admin
        Chat::where('sender_id', $userId)
            ->whereNull('receiver_id')
            ->where('is_read', false)
            ->update(['is_read' => true]);

        return response()->json([
            'success' => true,
            'messages' => $messages
        ]);
    }

    public function sendAdminMessage(Request $request, $userId): JsonResponse
    {
        $admin = $this->verifyAdmin($request);
        if (!$admin) {
            return response()->json(['success' => false, 'message' => 'Unauthorized'], 401);
        }

        $validator = Validator::make($request->all(), [
            'message' => 'required|string|max:5000'
        ]);

        if ($validator->fails()) {
            return response()->json(['success' => false, 'errors' => $validator->errors()], 422);
        }

        $chat = Chat::create([
            'sender_id' => $admin->id,
            'receiver_id' => $userId,
            'message' => $request->message,
            'is_read' => false
        ]);

        return response()->json([
            'success' => true,
            'message' => $chat
        ], 201);
    }
}
