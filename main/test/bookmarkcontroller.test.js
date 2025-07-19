import bookmarksController from '../app/controllers/bookmarksController.js';
import figurineDataMapper from '../app/models/figurineDataMapper.js';

// Mock du data mapper
jest.mock('../app/models/figurineDataMapper.js');

describe('bookmarksController', () => {
  let mockRequest;
  let mockResponse;

  beforeEach(() => {
    jest.clearAllMocks();

    mockRequest = {
      session: {}, // Simuler l'objet session
      params: {},
    };
    mockResponse = {
      render: jest.fn(),
      redirect: jest.fn(),
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
    };
  });

  // Test de bookmarksPage
  describe('bookmarksPage', () => {
    test('should render "favoris" with an empty bookmarks array if none exists', () => {
      // request.session.bookmarks est vide par défaut dans beforeEach
      bookmarksController.bookmarksPage(mockRequest, mockResponse);

      expect(mockRequest.session.bookmarks).toEqual([]);
      expect(mockResponse.render).toHaveBeenCalledWith('favoris', { bookmarks: [] });
    });

    test('should render "favoris" with existing bookmarks', () => {
      const existingBookmarks = [{ id: 1, name: 'Figurine 1' }];
      mockRequest.session.bookmarks = existingBookmarks;

      bookmarksController.bookmarksPage(mockRequest, mockResponse);

      expect(mockResponse.render).toHaveBeenCalledWith('favoris', { bookmarks: existingBookmarks });
    });
  });

  // Test de bookmarksAdd
  describe('bookmarksAdd', () => {
    test('should add a figurine to bookmarks if not already present', async () => {
      const figurineId = 1;
      const mockFigurine = { id: figurineId, name: 'New Figurine' };
      mockRequest.params = { id: figurineId };
      mockRequest.session.bookmarks = []; // Démarrer avec une session vide

      figurineDataMapper.getOneFigurine.mockResolvedValue(mockFigurine);

      await bookmarksController.bookmarksAdd(mockRequest, mockResponse);

      expect(figurineDataMapper.getOneFigurine).toHaveBeenCalledWith(figurineId);
      expect(mockRequest.session.bookmarks).toEqual([mockFigurine]);
      expect(mockResponse.redirect).toHaveBeenCalledWith('/bookmarks');
    });

    test('should not add a figurine if already present in bookmarks', async () => {
      const figurineId = 1;
      const mockFigurine = { id: figurineId, name: 'Existing Figurine' };
      mockRequest.params = { id: figurineId };
      mockRequest.session.bookmarks = [mockFigurine]; // Démarrer avec la figurine déjà présente

      await bookmarksController.bookmarksAdd(mockRequest, mockResponse);

      expect(figurineDataMapper.getOneFigurine).not.toHaveBeenCalled(); // Pas besoin de chercher si déjà là
      expect(mockRequest.session.bookmarks).toEqual([mockFigurine]); // La liste n'a pas changé
      expect(mockResponse.redirect).toHaveBeenCalledWith('/bookmarks');
    });

    test('should handle errors and send 500 status', async () => {
      const error = new Error('DB error');
      mockRequest.params = { id: '1' };
      figurineDataMapper.getOneFigurine.mockRejectedValue(error);
      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

      await bookmarksController.bookmarksAdd(mockRequest, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.send).toHaveBeenCalledWith('Server Error');
      expect(consoleErrorSpy).toHaveBeenCalledWith(error);
      consoleErrorSpy.mockRestore();
    });
  });

  // Test de bookmarksDelete
  describe('bookmarksDelete', () => {
    test('should delete a figurine from bookmarks if present', async () => {
      const figurineIdToDelete = 1;
      const figurineToKeep = { id: 2, name: 'Figurine to Keep' };
      const figurineToDelete = { id: figurineIdToDelete, name: 'Figurine to Delete' }; // Pour la comparaison dans .indexOf

      mockRequest.params = { id: figurineIdToDelete };
      mockRequest.session.bookmarks = [figurineToKeep, figurineToDelete]; // Initialiser avec deux figurines

      // Le bookmarkDelete utilise .indexOf, qui nécessite une référence exacte de l'objet
      // C'est un peu risqué car figurineDataMapper.getOneFigurine(figurineId) peut retourner un NOUVEL objet
      // Mieux vaut mocker getOneFigurine pour retourner l'objet qu'on a déjà dans la session
      figurineDataMapper.getOneFigurine.mockResolvedValue(figurineToDelete);


      await bookmarksController.bookmarksDelete(mockRequest, mockResponse);

      expect(figurineDataMapper.getOneFigurine).toHaveBeenCalledWith(figurineIdToDelete);
      expect(mockRequest.session.bookmarks).toEqual([figurineToKeep]); // Seule la figurine à garder reste
      expect(mockResponse.redirect).toHaveBeenCalledWith('/bookmarks');
    });

    test('should not change bookmarks if figurine is not present', async () => {
      const figurineIdToDelete = '3';
      const existingBookmarks = [{ id: 1, name: 'Figurine 1' }, { id: 2, name: 'Figurine 2' }];
      mockRequest.params = { id: figurineIdToDelete };
      mockRequest.session.bookmarks = [...existingBookmarks]; // Copie pour ne pas modifier l'original

    //   figurineDataMapper.getOneFigurine.mockResolvedValue(undefined); // Simule que la figurine n'est pas trouvée (donc pas en liste)

      await bookmarksController.bookmarksDelete(mockRequest, mockResponse);

      expect(figurineDataMapper.getOneFigurine).not.toHaveBeenCalled();
      expect(mockRequest.session.bookmarks).toEqual(existingBookmarks); // La liste n'a pas changé
      expect(mockResponse.redirect).toHaveBeenCalledWith('/bookmarks');
    });

    test('should handle errors and send 500 status', async () => {
      const error = new Error('DB error');
      mockRequest.params = { id: '1' };
      mockRequest.session.bookmarks = [{ id: 1 }]; 
      figurineDataMapper.getOneFigurine.mockRejectedValue(error);
      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

      await bookmarksController.bookmarksDelete(mockRequest, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.send).toHaveBeenCalledWith('Server Error');
      expect(consoleErrorSpy).toHaveBeenCalledWith(error);
      consoleErrorSpy.mockRestore();
    });
  });
});