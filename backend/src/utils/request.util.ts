import { Request } from 'express';
import { AuthRequest } from '../middlewares/auth.middleware';

/**
 * Get client IP address from request
 * Tries multiple sources in order of reliability
 */
export function getClientIp(req: Request): string | undefined {
  // Try X-Forwarded-For (most common in production behind proxy/load balancer)
  const xForwardedFor = req.headers['x-forwarded-for'];
  if (xForwardedFor) {
    // X-Forwarded-For can contain multiple IPs (client, proxy1, proxy2, ...)
    // First IP is the original client
    const ips = Array.isArray(xForwardedFor)
      ? xForwardedFor[0]
      : xForwardedFor.split(',')[0];
    return ips?.trim();
  }

  // Try X-Real-IP (nginx)
  const xRealIp = req.headers['x-real-ip'];
  if (xRealIp) {
    return Array.isArray(xRealIp) ? xRealIp[0] : xRealIp;
  }

  // Try CF-Connecting-IP (Cloudflare)
  const cfConnectingIp = req.headers['cf-connecting-ip'];
  if (cfConnectingIp) {
    return Array.isArray(cfConnectingIp) ? cfConnectingIp[0] : cfConnectingIp;
  }

  // Try req.ip (Express default)
  if (req.ip) {
    // Convert IPv6 localhost to IPv4
    return req.ip === '::1' ? '127.0.0.1' : req.ip;
  }

  // Fallback to socket remote address
  return req.socket?.remoteAddress;
}

/**
 * Get user agent from request
 */
export function getUserAgent(req: Request): string | undefined {
  const userAgent = req.headers['user-agent'];
  return Array.isArray(userAgent) ? userAgent[0] : userAgent;
}

/**
 * Get session data from request for activity logging
 * Includes IP, user agent, and authenticated user info (actor)
 */
export function getSessionData(req: Request | AuthRequest) {
  const authReq = req as AuthRequest;

  return {
    ipAddress: getClientIp(req),
    userAgent: getUserAgent(req),
    actorUserId: authReq.user?.userId,
    actorUserEmail: authReq.user?.email,
  };
}
