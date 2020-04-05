import MissionLifeUsersDataRepo from './index';

describe('Mission Life Users Data Repo', () => {
  it('should exist', () => {
    expect(MissionLifeUsersDataRepo).toEqual(jasmine.any(Function));
  });

  let documentClientSpy;

  beforeEach(() => {
    documentClientSpy = jasmine.createSpyObj('documentClientSpy', ['query']);
    documentClientSpy.query.and.returnValue({
      promise: () => Promise.resolve({ Items: [{ id: 1234 }] })
    });
  });

  describe('getSponsorshipIds', () => {
    it('Should sponsorship ids', async () => {
      const missionLifeUsersDataRepo = new MissionLifeUsersDataRepo(
        documentClientSpy
      );

      const sponsorshipIds = await missionLifeUsersDataRepo.getSponsorshipIds(
        'aUserEmail@email.com'
      );

      expect(sponsorshipIds).toEqual(jasmine.any(Array));
    });

    it('should throw if userEmail is not a string', async () => {
      const missionLifeUsersDataRepo = new MissionLifeUsersDataRepo(
        documentClientSpy
      );

      try {
        await missionLifeUsersDataRepo.getSponsorshipIds(
          null
        );
        fail();
      } catch (error) {
        expect(error.message).toContain('userEmail');
      }
    })
  });
});
