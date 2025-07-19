import mainController from '../app/controllers/mainController.js';
import figurineDataMapper from '../app/models/figurineDataMapper.js';

// Mock du data mapper pour ne pas dépendre de la DB
jest.mock('../app/models/figurineDataMapper.js');

describe('mainController', () => {
  let mockRequest;
  let mockResponse;
  let mockNext;

  beforeEach(() => {
    // Réinitialiser les mocks avant chaque test
    jest.clearAllMocks();

    // Simuler les objets request, response et next d'Express
    mockRequest = {};
    mockResponse = {
      render: jest.fn(),
      status: jest.fn().mockReturnThis(), // Permet de chaîner .status().send()
      send: jest.fn(),
    };
    mockNext = jest.fn();
  });

  // Test de homePage
  describe('homePage', () => {
    test('should render "accueil" with all figurines', async () => {
      const mockFigurines = [{ id: 1, name: 'Figurine 1' }, { id: 2, name: 'Figurine 2' }];
      figurineDataMapper.getAllFigurines.mockResolvedValue(mockFigurines);

      await mainController.homePage(mockRequest, mockResponse);

      expect(figurineDataMapper.getAllFigurines).toHaveBeenCalledTimes(1);
      expect(mockResponse.render).toHaveBeenCalledWith('accueil', { figurines: mockFigurines });
      expect(mockResponse.status).not.toHaveBeenCalled(); // Pas d'erreur, donc pas de status 500
    });

    test('should handle errors and send 500 status', async () => {
      const error = new Error('Database error');
      figurineDataMapper.getAllFigurines.mockRejectedValue(error);
      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {}); // Supprimer les logs d'erreur pendant le test

      await mainController.homePage(mockRequest, mockResponse);

      expect(figurineDataMapper.getAllFigurines).toHaveBeenCalledTimes(1);
      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.send).toHaveBeenCalledWith('Server Error');
      expect(consoleErrorSpy).toHaveBeenCalledWith(error);
      consoleErrorSpy.mockRestore(); // Restaurer console.error
    });
  });

  // Test de articlePage
  describe('articlePage', () => {
    test('should render "article" with figurine and reviews', async () => {
      const figurineId = 1;
      mockRequest.params = { id: figurineId };
      const mockFigurine = { id: figurineId, name: 'Figurine Test' };
      const mockReviews = [{ id: 1, text: 'Review 1' }];

      figurineDataMapper.getOneFigurine.mockResolvedValue(mockFigurine);
      figurineDataMapper.getAllReviews.mockResolvedValue(mockReviews);

      await mainController.articlePage(mockRequest, mockResponse);

      expect(figurineDataMapper.getOneFigurine).toHaveBeenCalledWith(figurineId);
      expect(figurineDataMapper.getAllReviews).toHaveBeenCalledWith(figurineId);
      expect(mockResponse.render).toHaveBeenCalledWith('article', { figurine: mockFigurine, reviews: mockReviews });
    });

    test('should handle errors and send 500 status', async () => {
      const error = new Error('DB error');
      mockRequest.params = { id: '1' };
      figurineDataMapper.getOneFigurine.mockRejectedValue(error);
      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

      await mainController.articlePage(mockRequest, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.send).toHaveBeenCalledWith('Server Error');
      expect(consoleErrorSpy).toHaveBeenCalledWith(error);
      consoleErrorSpy.mockRestore();
    });
  });

  // Test de categoryPage
  describe('categoryPage', () => {
    test('should render "accueil" with figurines for a given category', async () => {
      const category = 'Fantasy';
      mockRequest.params = { category };
      const mockFigurines = [{ id: 1, name: 'Figurine Fantasy' }];
      figurineDataMapper.getCategory.mockResolvedValue(mockFigurines);

      await mainController.categoryPage(mockRequest, mockResponse, mockNext);

      expect(figurineDataMapper.getCategory).toHaveBeenCalledWith(category);
      expect(mockResponse.render).toHaveBeenCalledWith('accueil', { figurines: mockFigurines });
      expect(mockNext).not.toHaveBeenCalled(); // Pas d'appel à next() car figurines trouvées
    });

    test('should call next() if no figurines are found for the category', async () => {
      const category = 'NonExistent';
      mockRequest.params = { category };
      figurineDataMapper.getCategory.mockResolvedValue([]); // Retourne un tableau vide

      await mainController.categoryPage(mockRequest, mockResponse, mockNext);

      expect(figurineDataMapper.getCategory).toHaveBeenCalledWith(category);
      expect(mockResponse.render).not.toHaveBeenCalled(); // Pas de rendu
      expect(mockNext).toHaveBeenCalledTimes(1); // next() appelé pour gérer 404 par ex.
    });

    test('should handle errors and send 500 status', async () => {
      const error = new Error('DB error');
      mockRequest.params = { category: 'Test' };
      figurineDataMapper.getCategory.mockRejectedValue(error);
      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

      await mainController.categoryPage(mockRequest, mockResponse, mockNext);

      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.send).toHaveBeenCalledWith('Server Error');
      expect(consoleErrorSpy).toHaveBeenCalledWith(error);
      consoleErrorSpy.mockRestore();
    });
  });

  // Test de search
  describe('search', () => {
    test('should render "article" with figurine and reviews for a search query', async () => {
      const query = 'cloud';
      mockRequest.query = { query };
      const mockFigurine = { id: 10, name: 'Cloud' };
      const mockReviews = [{ id: 1, text: 'Great figure!' }];

      figurineDataMapper.search.mockResolvedValue(mockFigurine);
      figurineDataMapper.getAllReviews.mockResolvedValue(mockReviews);

      await mainController.search(mockRequest, mockResponse, mockNext);

      expect(figurineDataMapper.search).toHaveBeenCalledWith(query);
      expect(figurineDataMapper.getAllReviews).toHaveBeenCalledWith(mockFigurine.id);
      expect(mockResponse.render).toHaveBeenCalledWith('article', { figurine: mockFigurine, reviews: mockReviews });
    });

    test('should handle errors and send 500 status', async () => {
      const error = new Error('DB error');
      mockRequest.query = { query: 'test' };
      figurineDataMapper.search.mockRejectedValue(error);
      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

      await mainController.search(mockRequest, mockResponse, mockNext);

      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.send).toHaveBeenCalledWith('Server Error');
      expect(consoleErrorSpy).toHaveBeenCalledWith(error);
      consoleErrorSpy.mockRestore();
    });
  });
});