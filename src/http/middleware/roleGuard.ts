import { Request, Response, NextFunction } from 'express';

export function roleGuard(...allowed: string[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    const u = (req as any).user as { roles?: string[] } | undefined;
    if (!u?.roles?.some(r => allowed.includes(r)))
      return res.status(403).json({ error: 'Forbidden' });
    next();
  };
}
