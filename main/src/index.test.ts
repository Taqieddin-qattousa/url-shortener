import { describe, it, expect } from 'vitest'

import request from 'supertest';
import { app } from './index';

describe('URL Shortener Service', () => {
  it('should shorten a URL and redirect correctly', async () => {
    const longUrl = 'http://example.com';

    // Shorten the URL
    const response = await request(app)
      .put('/shorten')
      .send({ url: longUrl })
      .expect(200);

    const shortUrl = response.text;
    expect(shortUrl).toBeDefined();

    // Test redirection
    await request(app)
      .get(`/${shortUrl}`)
      .expect(302)
      .expect('Location', longUrl);
  });

  it('should return a 404 for a non-existent short URL', async () => {
    const nonExistentShortUrl = 'nonexistent';

    await request(app)
      .get(`/s/${nonExistentShortUrl}`)
      .expect(404);
  });
});
