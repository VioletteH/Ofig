import figurineDataMapper from '../app/models/figurineDataMapper.js';
import client from '../app/models/database.js'; // Le client de base de données

// Mock du client de la base de données
jest.mock('../app/models/database.js');

const normalizeSql = (sql) => {
    return sql.replace(/\s+/g, ' ').replace(/\u00A0/g, ' ').trim();
};

describe('figurineDataMapper', () => {
  // Avant chaque test, réinitialiser les mocks
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // Test de getAllFigurines
  describe('getAllFigurines', () => {
    test('should return all figurines with average note', async () => {
      const mockRows = [{ id: 1, name: 'Figurine 1', note: 4 }, { id: 2, name: 'Figurine 2', note: 3.5 }];
      client.query.mockResolvedValue({ rows: mockRows });

      const figurines = await figurineDataMapper.getAllFigurines();

      expect(client.query).toHaveBeenCalledTimes(1);
      const expectedQueryPart = `
        SELECT figurine.*, AVG(note) as note
        FROM figurine
        LEFT JOIN review`;

      const actualQuery = client.query.mock.calls[0][0];
      expect(normalizeSql(actualQuery)).toContain(normalizeSql(expectedQueryPart));
      expect(figurines).toEqual(mockRows);
    });

    test('should handle database errors', async () => {
      const error = new Error('DB connection failed');
      client.query.mockRejectedValue(error);

      await expect(figurineDataMapper.getAllFigurines()).rejects.toThrow('DB connection failed');
      expect(client.query).toHaveBeenCalledTimes(1);
    });
  });

  // Test de getOneFigurine
  describe('getOneFigurine', () => {
    test('should return a single figurine by ID with average note', async () => {
      const mockFigurine = { id: 1, name: 'Figurine 1', note: 4 };
      client.query.mockResolvedValue({ rows: [mockFigurine] });

      const figurine = await figurineDataMapper.getOneFigurine(1);

      expect(client.query).toHaveBeenCalledTimes(1);
      expect(client.query).toHaveBeenCalledWith(expect.stringContaining('WHERE figurine.id = $1'), [1]);
      expect(figurine).toEqual(mockFigurine);
    });

    test('should return undefined if figurine not found', async () => {
      client.query.mockResolvedValue({ rows: [] });

      const figurine = await figurineDataMapper.getOneFigurine(999);

      expect(figurine).toBeUndefined();
    });
  });

  // Test de getAllReviews
  describe('getAllReviews', () => {
    test('should return all reviews for a given figurine ID', async () => {
      const mockReviews = [{ id: 1, figurine_id: 10, title: 'Great!' }];
      client.query.mockResolvedValue({ rows: mockReviews });

      const reviews = await figurineDataMapper.getAllReviews(10);

      expect(client.query).toHaveBeenCalledTimes(1);
      const expectedQuery = `
        SELECT * 
        FROM "review"
        WHERE "figurine_id" = $1`;

  const actualQuery = client.query.mock.calls[0][0];

  expect(normalizeSql(actualQuery)).toContain(normalizeSql(expectedQuery));
  expect(client.query.mock.calls[0][1]).toEqual([10]);
  expect(reviews).toEqual(mockReviews);
    });
  });

  // Test de getCategory
  describe('getCategory', () => {
    test('should return figurines by category with average note', async () => {
      const mockFigurines = [{ id: 3, name: 'Figurine C', category: 'CategoryX' }];
      client.query.mockResolvedValue({ rows: mockFigurines });

      const figurines = await figurineDataMapper.getCategory('CategoryX');

      expect(client.query).toHaveBeenCalledTimes(1);
      expect(client.query).toHaveBeenCalledWith(expect.stringContaining('WHERE category = $1'), ['CategoryX']);
      expect(figurines).toEqual(mockFigurines);
    });
  });

  // Test de countCategory
  describe('countCategory', () => {
    test('should return category counts', async () => {
      const mockCounts = [{ category: 'CategoryA', count: 5 }, { category: 'CategoryB', count: 3 }];
      client.query.mockResolvedValue({ rows: mockCounts });

      const counts = await figurineDataMapper.countCategory();

      expect(client.query).toHaveBeenCalledTimes(1);
      expect(client.query).toHaveBeenCalledWith('SELECT category, COUNT(*) as count FROM figurine GROUP BY category;');
      expect(counts).toEqual(mockCounts);
    });
  });

  // Test de search
  describe('search', () => {
    test('should return figurine by name search with average note', async () => {
      const mockFigurine = { id: 4, name: 'Searched Figurine' };
      client.query.mockResolvedValue({ rows: [mockFigurine] });

      const figurine = await figurineDataMapper.search('searched');

      expect(client.query).toHaveBeenCalledTimes(1);
      expect(client.query).toHaveBeenCalledWith(expect.stringContaining('WHERE figurine.name ILIKE $1'), ['%searched%']);
      expect(figurine).toEqual(mockFigurine);
    });

    test('should return undefined if no figurine found for search', async () => {
      client.query.mockResolvedValue({ rows: [] });

      const figurine = await figurineDataMapper.search('nonexistent');

      expect(figurine).toBeUndefined();
    });
  });
});