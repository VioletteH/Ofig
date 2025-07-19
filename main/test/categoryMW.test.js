import categoriesMW from '../app/middlewares/categories.js';
import figurineDataMapper from '../app/models/figurineDataMapper.js';

// Mock du data mapper
jest.mock('../app/models/figurineDataMapper.js');

describe('categoriesMW', () => {
  let mockRequest;
  let mockResponse;
  let mockNext;

  beforeEach(() => {
    jest.clearAllMocks();

    mockRequest = {};
    mockResponse = {
      locals: {}, // Simule res.locals
    };
    mockNext = jest.fn();
  });

  test('should add categories to res.locals and call next()', async () => {
    const mockCategories = [
      { category: 'Manga', count: 5 },
      { category: 'Movie', count: 3 },
    ];
    figurineDataMapper.countCategory.mockResolvedValue(mockCategories);

    await categoriesMW(mockRequest, mockResponse, mockNext);

    expect(figurineDataMapper.countCategory).toHaveBeenCalledTimes(1);
    expect(mockResponse.locals.categories).toEqual(mockCategories);
    expect(mockNext).toHaveBeenCalledTimes(1);
  });

  test('should handle errors in dataMapper and still call next() (or send 500 in real app)', async () => {
    // Le middleware actuel ne gère pas directement l'erreur via un status 500
    // Il laisse l'erreur se propager. Dans une vraie app, un errorHandler global serait nécessaire.
    // Pour ce test, nous nous assurons que next() est toujours appelé.
    const error = new Error('DB connection error');
    figurineDataMapper.countCategory.mockRejectedValue(error);
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

    await categoriesMW(mockRequest, mockResponse, mockNext);

    expect(figurineDataMapper.countCategory).toHaveBeenCalledTimes(1);
    expect(mockResponse.locals.categories).toBeUndefined(); // Ou un comportement par défaut si défini
    expect(mockNext).toHaveBeenCalledWith(error); // Le middleware passe l'erreur à next
    expect(consoleErrorSpy).toHaveBeenCalledWith(error);
    consoleErrorSpy.mockRestore();
  });
});