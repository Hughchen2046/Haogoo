db.json檔格式筆記
使用者
"users": [
        {
            "id": 1,
            "name": "Haogoo",
            "email": "haogoo@gmail.com",
            "avatar": "https://plus.unsplash.com/premium_vector-1682269287900-d96e9a6c188b?q=80&w=1160&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", //人物大頭圖像
            "password": "123456",
            "vipExpiredAt": null, //VIP過期時間
            "createdAt": "2025-12-22T14:59:59.000Z", //建立使用者的時間
            "updatedAt": "2025-12-22T14:59:59.000Z", //更新使用者資料的時間
            "role": "guest", //權限 admin / VIP / member / guest
            "preferences": {  //偏好設定 目前有設定背景主題 日/夜
                "theme": "day"
            },
            "socialLinks": { //社群連結資訊
                "website": "https://haogoo.com"
            },
            "stats": { //個人狀態
                "postCount": 1, //總共發文的文章數
                "reputation": 3 //總共被跟蹤的數量
            }
        }]

"watchlists": [
        {
            "id": 1,
            "userId": 1,
            "name": "預設清單", //清單名稱,可改
            "isDefault": true, //是否預設清單
            "isPublic": false, //是否公開
            "sortOrder": 0, //清單順序
            "createdAt": "2025-12-22T14:59:59.000Z",
            "followerCount": 0, //追蹤清單人數
            "items": [
                {
                    "symbol": "2330",
                    "name": "台積電"
                },
                {
                    "symbol": "0050",
                    "name": "元大台灣50"
                }
            ]
        },]

         "posts": [
        {
            "id": 1,
            "userId": 1,
            "status": "published", // published (發布) / draft (草稿) / archived (封存)
            "title": "台積電 Q1 財報分析",
            "content": "根據最新財報，台積電...",
            "symbolId": "2330",
            "category": "財報分析",
            "hashtags": [
                "半導體",
                "財報",
                "護國神山"
            ],
            "viewCount": 128, //觀看次數
            "likeCount": 15, //所有reactions加總
            "reactions": { //心情留言
                "like": 2,
                "heart": 1,
                "laugh": 0
            },
            "commentCount": 1, //留言數
            "isPinned": false, //置頂
            "createdAt": "2025-12-23T08:00:00.000Z",
            "updatedAt": "2025-12-23T08:00:00.000Z"
        }
    ],

    "comments": [
        {
            "id": 1,
            "postId": 1, //關聯的發文 ID
            "userId": 2,
            "parentId": null, //若為回覆留言，填入被回覆的 comment ID；若為一級留言則為 null
            "content": "分析的很詳細，感謝分享！",
            "reactions": { //心情留言
                "like": 2,
                "heart": 1,
                "laugh": 0
            },
            "isMarked": true, //精選留言
            "mentions": [
                5,
                8
            ], //提及, tag誰,(User ID)
            "createdAt": "2025-12-23T09:00:00.000Z",
            "updatedAt": "2025-12-23T09:00:00.000Z"
        }
    ],
    "likes": [
        {
            "id": 1,
            "userId": 2, // 誰按的
            "targetType": "post", // 目標類型: "post" 或 "comment"
            "targetId": 1, // 目標 ID
            "type": "heart", // 心情類型
            "createdAt": "2025-12-23T09:05:00.000Z"
        }
    ],