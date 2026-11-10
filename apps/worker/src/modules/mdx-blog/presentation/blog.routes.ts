import { Hono } from 'hono';
import type { AppEnv } from '../../../core/env';
import {
  BLOG_DESCRIPTION,
  BLOG_LANGUAGE,
  BLOG_TITLE,
  renderAtom,
  renderRss,
} from '../domain/feed';
import { createD1BlogRepository } from '../infrastructure/d1-blog.repository';

const FEED_LIMIT = 50;

export const createBlogRouter = (): Hono<AppEnv> => {
  const router = new Hono<AppEnv>();

  const loadPosts = async (c: { env: AppEnv['Bindings'] }, siteUrl: string) => {
    const repository = createD1BlogRepository(c.env.DB, siteUrl);
    return repository.listPublished(FEED_LIMIT);
  };

  router.get('/feed.xml', async (c) => {
    const siteUrl = new URL(c.req.url).origin;
    const posts = await loadPosts(c, siteUrl);
    const body = renderRss(
      { siteUrl, title: BLOG_TITLE, description: BLOG_DESCRIPTION, language: BLOG_LANGUAGE },
      posts
    );
    return c.body(body, 200, {
      'content-type': 'application/xml; charset=utf-8',
      'cache-control': 'public, max-age=3600, stale-while-revalidate=86400',
    });
  });

  router.get('/atom.xml', async (c) => {
    const siteUrl = new URL(c.req.url).origin;
    const posts = await loadPosts(c, siteUrl);
    const body = renderAtom(
      { siteUrl, title: BLOG_TITLE, description: BLOG_DESCRIPTION, language: BLOG_LANGUAGE },
      posts
    );
    return c.body(body, 200, {
      'content-type': 'application/xml; charset=utf-8',
      'cache-control': 'public, max-age=3600, stale-while-revalidate=86400',
    });
  });

  return router;
};
