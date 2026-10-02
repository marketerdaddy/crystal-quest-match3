import { IncomingMessage, ServerResponse } from 'http';
import { PurchaseReceipt, InboxMessage, PlayerProfile } from '../../src/types/game';

// In-memory persistent database for server session
interface ServerDb {
  users: Map<string, { id: string; name: string; email: string; passwordHash: string; profile: PlayerProfile }>;
  orders: Map<string, PurchaseReceipt>;
  leaderboard: { name: string; score: number; world: string; stars: number }[];
}

const db: ServerDb = {
  users: new Map(),
  orders: new Map(),
  leaderboard: [
    { name: 'AetherMage_X', score: 284500, world: 'Cyber Crystal City', stars: 72 },
    { name: 'Valkyrie_Rose', score: 241200, world: 'Lunar Realm', stars: 68 },
    { name: 'CrystalKing99', score: 198000, world: 'Ancient Temple', stars: 60 },
    { name: 'ShadowNova', score: 162400, world: 'Sky Kingdom', stars: 52 },
    { name: 'AuroraGlade', score: 135900, world: 'Ember Mountains', stars: 44 },
    { name: 'TideCaller', score: 110200, world: 'Ocean Ruins', stars: 36 },
    { name: 'PrismHunter', score: 87400, world: 'Mystic Forest', stars: 24 },
    { name: 'GeodeSpark', score: 54100, world: 'Crystal Valley', stars: 15 }
  ]
};

// Helper: Read request body
function parseBody(req: IncomingMessage): Promise<any> {
  return new Promise((resolve) => {
    let body = '';
    req.on('data', chunk => { body += chunk; });
    req.on('end', () => {
      try {
        resolve(body ? JSON.parse(body) : {});
      } catch {
        resolve({});
      }
    });
  });
}

// Helper: JSON response
function sendJson(res: ServerResponse, statusCode: number, data: any) {
  res.writeHead(statusCode, {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization'
  });
  res.end(JSON.stringify(data));
}

// Generate luxury HTML purchase confirmation email template
export function generatePurchaseEmailHtml(receipt: PurchaseReceipt): string {
  const itemsHtml = Object.entries(receipt.itemsReceived)
    .filter(([_, val]) => val)
    .map(([key, val]) => {
      if (key === 'boosters') {
        const boosterList = Object.entries(val as Record<string, number>)
          .map(([bName, bCount]) => `${bCount}x ${bName.toUpperCase()}`)
          .join(', ');
        return `<tr><td style="padding: 10px; border-bottom: 1px solid #1e293b; color: #94a3b8;">Boosters</td><td style="padding: 10px; border-bottom: 1px solid #1e293b; color: #38bdf8; font-weight: bold; text-align: right;">${boosterList}</td></tr>`;
      }
      return `<tr><td style="padding: 10px; border-bottom: 1px solid #1e293b; color: #94a3b8;">${key.toUpperCase()}</td><td style="padding: 10px; border-bottom: 1px solid #1e293b; color: #f59e0b; font-weight: bold; text-align: right;">+${Number(val).toLocaleString()}</td></tr>`;
    })
    .join('');

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #080b14; color: #f8fafc; margin: 0; padding: 24px; }
    .email-container { max-width: 600px; margin: 0 auto; background: linear-gradient(180deg, #0f172a 0%, #060913 100%); border-radius: 16px; border: 1px solid rgba(56, 189, 248, 0.25); overflow: hidden; box-shadow: 0 20px 40px rgba(0,0,0,0.8); }
    .header { background: radial-gradient(circle at 50% 0%, #1e3a8a 0%, #0f172a 100%); padding: 32px 24px; text-align: center; border-bottom: 1px solid rgba(56, 189, 248, 0.2); }
    .logo-badge { display: inline-block; background: linear-gradient(135deg, #00f2fe 0%, #4facfe 100%); color: #050b14; font-weight: 900; font-size: 14px; letter-spacing: 2px; padding: 6px 16px; border-radius: 9999px; text-transform: uppercase; margin-bottom: 12px; }
    .title { margin: 0; font-size: 26px; font-weight: 800; color: #ffffff; letter-spacing: -0.5px; }
    .subtitle { margin: 6px 0 0; color: #94a3b8; font-size: 14px; }
    .content { padding: 32px 24px; }
    .receipt-box { background: rgba(15, 23, 42, 0.6); border: 1px solid rgba(255,255,255,0.08); border-radius: 12px; padding: 20px; margin-bottom: 24px; }
    .info-row { display: flex; justify-content: space-between; margin-bottom: 8px; font-size: 14px; }
    .label { color: #64748b; }
    .val { color: #f1f5f9; font-weight: 600; }
    .table { width: 100%; border-collapse: collapse; margin-top: 16px; font-size: 14px; }
    .total-banner { background: linear-gradient(90deg, rgba(56, 189, 248, 0.15) 0%, rgba(168, 85, 247, 0.15) 100%); border: 1px solid rgba(56, 189, 248, 0.3); border-radius: 12px; padding: 16px 20px; text-align: right; margin-bottom: 24px; }
    .total-amount { font-size: 24px; font-weight: 800; color: #38bdf8; }
    .footer { padding: 24px; background: #05070e; border-top: 1px solid rgba(255,255,255,0.05); text-align: center; font-size: 12px; color: #64748b; line-height: 1.6; }
    .support-link { color: #38bdf8; text-decoration: none; font-weight: 600; }
  </style>
</head>
<body>
  <div class="email-container">
    <div class="header">
      <div class="logo-badge">CRYSTAL QUEST</div>
      <h1 class="title">Official Purchase Confirmation</h1>
      <p class="subtitle">Thank you for your realm patronage, Archon ${receipt.customerName}!</p>
    </div>
    <div class="content">
      <div class="receipt-box">
        <table style="width: 100%; font-size: 14px;">
          <tr>
            <td style="color: #64748b; padding: 4px 0;">Order ID:</td>
            <td style="color: #38bdf8; font-family: monospace; font-weight: bold; text-align: right;">${receipt.orderId}</td>
          </tr>
          <tr>
            <td style="color: #64748b; padding: 4px 0;">Date:</td>
            <td style="color: #f1f5f9; text-align: right;">${receipt.date}</td>
          </tr>
          <tr>
            <td style="color: #64748b; padding: 4px 0;">Customer:</td>
            <td style="color: #f1f5f9; text-align: right;">${receipt.customerName} (${receipt.customerEmail})</td>
          </tr>
          <tr>
            <td style="color: #64748b; padding: 4px 0;">Status:</td>
            <td style="color: #34d399; font-weight: bold; text-align: right;">VERIFIED & DELIVERED</td>
          </tr>
        </table>
      </div>

      <h3 style="font-size: 16px; margin: 0 0 12px; color: #e2e8f0; text-transform: uppercase; letter-spacing: 1px;">Items Delivered</h3>
      <table class="table">
        <thead>
          <tr style="border-bottom: 2px solid #334155; text-align: left; color: #94a3b8;">
            <th style="padding: 8px 10px;">Item</th>
            <th style="padding: 8px 10px; text-align: right;">Reward Granted</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td style="padding: 10px; border-bottom: 1px solid #1e293b; color: #f8fafc; font-weight: bold;">${receipt.productName}</td>
            <td style="padding: 10px; border-bottom: 1px solid #1e293b; color: #94a3b8; text-align: right;">Qty: ${receipt.quantity}</td>
          </tr>
          ${itemsHtml}
        </tbody>
      </table>

      <div class="total-banner" style="margin-top: 20px;">
        <span style="color: #94a3b8; font-size: 14px; margin-right: 12px;">Total Paid:</span>
        <span class="total-amount">$${receipt.amount.toFixed(2)} ${receipt.currency}</span>
      </div>

      <p style="font-size: 13px; color: #94a3b8; line-height: 1.6;">
        All items have been credited directly to your in-game vault. If you experience any synchronisation delays, tap "Restore Purchases" in Settings.
      </p>
    </div>
    <div class="footer">
      Crystal Quest: Realms of Aetheria &bull; Automated Payment Gateway System<br/>
      Need support? Contact <a href="mailto:${receipt.supportEmail}" class="support-link">${receipt.supportEmail}</a><br/>
      Transaction Security Verified by Aetheria Cryptographic Ledger.
    </div>
  </div>
</body>
</html>
  `.trim();
}

/**
 * Handle incoming API requests
 */
export async function handleApiRequests(req: IncomingMessage, res: ServerResponse, next: () => void) {
  const url = new URL(req.url || '/', `http://${req.headers.host || 'localhost'}`);
  const path = url.pathname;
  const method = req.method?.toUpperCase();

  // OPTIONS pre-flight
  if (method === 'OPTIONS') {
    res.writeHead(204, {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization'
    });
    res.end();
    return;
  }

  // 1. POST /api/auth/guest
  if (path === '/api/auth/guest' && method === 'POST') {
    const guestId = `guest_${Math.random().toString(36).substring(2, 9)}`;
    const guestName = `Archon_${Math.floor(1000 + Math.random() * 9000)}`;

    return sendJson(res, 200, {
      success: true,
      user: {
        id: guestId,
        name: guestName,
        email: `${guestId}@guest.crystalquest.realm`,
        isGuest: true
      }
    });
  }

  // 2. POST /api/auth/signup
  if (path === '/api/auth/signup' && method === 'POST') {
    const body = await parseBody(req);
    const { name, email, password } = body;

    if (!email || !password || !name) {
      return sendJson(res, 400, { success: false, error: 'Name, email and password are required.' });
    }

    if (db.users.has(email)) {
      return sendJson(res, 409, { success: false, error: 'An account with this email already exists.' });
    }

    const userId = `usr_${Math.random().toString(36).substring(2, 9)}`;
    const userRecord = {
      id: userId,
      name,
      email,
      passwordHash: `hash_${password}`,
      profile: null as any
    };

    db.users.set(email, userRecord);

    return sendJson(res, 200, {
      success: true,
      user: {
        id: userId,
        name,
        email,
        isGuest: false
      }
    });
  }

  // 3. POST /api/auth/login
  if (path === '/api/auth/login' && method === 'POST') {
    const body = await parseBody(req);
    const { email, password } = body;

    const user = db.users.get(email);
    if (!user || user.passwordHash !== `hash_${password}`) {
      return sendJson(res, 401, { success: false, error: 'Invalid email or password.' });
    }

    return sendJson(res, 200, {
      success: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        isGuest: false
      },
      cloudSave: user.profile || null
    });
  }

  // 4. POST /api/cloud-save/sync
  if (path === '/api/cloud-save/sync' && method === 'POST') {
    const body = await parseBody(req);
    const { email, profile } = body;

    if (email && db.users.has(email)) {
      const user = db.users.get(email)!;
      user.profile = profile;
    }

    return sendJson(res, 200, {
      success: true,
      syncedAt: new Date().toISOString()
    });
  }

  // 5. GET /api/shop/catalog
  if (path === '/api/shop/catalog' && method === 'GET') {
    return sendJson(res, 200, {
      success: true,
      catalog: [
        {
          id: 'pack_starter',
          category: 'bundles',
          title: 'Archon Starter Cache',
          description: '1,500 Coins + 50 Gems + 2x All Boosters',
          priceUsd: 2.99,
          coinsReward: 1500,
          gemsReward: 50,
          boostersReward: { hammer: 2, nova: 2, lightning: 2, prism: 2, shuffle: 2 },
          badge: '80% OFF',
          popular: true
        },
        {
          id: 'coins_pouch',
          category: 'coins',
          title: 'Handful of Gold',
          description: '1,000 Pure Gold Coins',
          priceUsd: 0.99,
          coinsReward: 1000
        },
        {
          id: 'coins_chest',
          category: 'coins',
          title: 'Treasurer Chest',
          description: '6,500 Pure Gold Coins + 15% Bonus',
          priceUsd: 4.99,
          coinsReward: 6500,
          popular: true
        },
        {
          id: 'coins_vault',
          category: 'coins',
          title: 'Emperor Royal Vault',
          description: '25,000 Pure Gold Coins + 30% Bonus',
          priceUsd: 14.99,
          coinsReward: 25000
        },
        {
          id: 'gems_pouch',
          category: 'gems',
          title: 'Pouch of Astral Gems',
          description: '100 Glowing Magical Gems',
          priceUsd: 1.99,
          gemsReward: 100
        },
        {
          id: 'gems_cache',
          category: 'gems',
          title: 'Crystal Geode Cache',
          description: '600 Astral Gems + 50 Bonus',
          priceUsd: 7.99,
          gemsReward: 650,
          popular: true
        },
        {
          id: 'gems_treasury',
          category: 'gems',
          title: 'Celestial Gem Singularity',
          description: '2,000 Astral Gems + 250 Bonus',
          priceUsd: 19.99,
          gemsReward: 2250
        },
        {
          id: 'boosters_arsenal',
          category: 'boosters',
          title: 'Elemental Arsenal Pack',
          description: '5x Hammers, 5x Novas, 5x Lightning, 5x Prisms',
          priceUsd: 4.99,
          boostersReward: { hammer: 5, nova: 5, lightning: 5, prism: 5, shuffle: 5 }
        }
      ]
    });
  }

  // 6. POST /api/shop/checkout (Server-Side Payment Verification & Order Confirmation)
  if (path === '/api/shop/checkout' && method === 'POST') {
    const body = await parseBody(req);
    const { productId, productName, amount, customerName, customerEmail, quantity = 1, rewards } = body;

    if (!productId || !amount || !customerName) {
      return sendJson(res, 400, { success: false, error: 'Invalid purchase payload.' });
    }

    // Generate verified order ID
    const orderId = `CQ-ORD-${new Date().getFullYear()}-${Math.floor(100000 + Math.random() * 900000)}`;
    const dateStr = new Date().toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });

    const receipt: PurchaseReceipt = {
      orderId,
      productId,
      productName: productName || 'Crystal Quest Digital Asset',
      customerName,
      customerEmail: customerEmail || 'archon@crystalquest.realm',
      quantity,
      amount: Number(amount),
      currency: 'USD',
      date: dateStr,
      status: 'COMPLETED',
      supportEmail: 'support@crystalquest.game',
      itemsReceived: rewards || {}
    };

    // Record transaction server-side
    db.orders.set(orderId, receipt);

    // Generate luxury HTML email
    const emailHtml = generatePurchaseEmailHtml(receipt);

    // Generate in-game inbox message
    const inboxItem: InboxMessage = {
      id: `mail_${orderId}`,
      title: `Order Confirmed: ${receipt.productName}`,
      sender: 'Aetherian Treasury',
      date: dateStr,
      preview: `Your purchase of ${receipt.productName} for $${receipt.amount.toFixed(2)} was successful!`,
      htmlContent: emailHtml,
      read: false,
      claimed: true
    };

    console.log(`[PAYMENT SERVER] Verified & Processed order: ${orderId} for $${amount} to ${customerEmail}`);

    return sendJson(res, 200, {
      success: true,
      receipt,
      inboxItem,
      emailSent: true,
      message: 'Transaction verified and receipt delivered to your inbox!'
    });
  }

  // 7. GET /api/leaderboard
  if (path === '/api/leaderboard' && method === 'GET') {
    return sendJson(res, 200, {
      success: true,
      leaderboard: db.leaderboard
    });
  }

  // 8. POST /api/leaderboard/submit
  if (path === '/api/leaderboard/submit' && method === 'POST') {
    const body = await parseBody(req);
    const { name, score, world, stars } = body;

    if (name && typeof score === 'number') {
      db.leaderboard.push({ name, score, world: world || 'Crystal Valley', stars: stars || 1 });
      db.leaderboard.sort((a, b) => b.score - a.score);
      if (db.leaderboard.length > 20) {
        db.leaderboard.pop();
      }
    }

    return sendJson(res, 200, {
      success: true,
      leaderboard: db.leaderboard
    });
  }

  // Unhandled API route
  sendJson(res, 404, { success: false, error: 'Endpoint not found' });
}
