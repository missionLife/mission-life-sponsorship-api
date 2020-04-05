import MissionLifeUsersDataRepo from './index';

describe('Mission Life Users Data Repo', () => {
  it('should exist', () => {
    expect(MissionLifeUsersDataRepo).toEqual(jasmine.any(Function));
  });

  let documentClientSpy;

  beforeEach(() => {
    documentClientSpy = jasmine.createSpyObj('documentClientSpy', ['query']);
    documentClientSpy.query.and.returnValue({
      promise: () => Promise.resolve({
        Items: [
          {
            SPONSORSHIP_ID: 1234,
            EMAIL: 'aUserEmail@email.com'
          },
          {
            SPONSORSHIP_ID: 5678,
            EMAIL: 'aUserEmail@email.com'
          }
        ] 
      })
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
      expect(sponsorshipIds).toEqual([1234, 5678]);
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
