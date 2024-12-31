const { Pool } = require('pg');

class PlaylistsService {
  constructor() {
    this.pool = new Pool();
  }

  async getSongsFromPlaylist({ credentialId, playlistId }) {
    console.log(credentialId, playlistId);
    const queryPlaylist = {
      text: `SELECT playlists.id, playlists.name
             FROM playlists
             JOIN users ON playlists.owner = users.id
             WHERE playlists.owner = $1 AND playlists.id = $2`,
      values: [credentialId, playlistId],
    };

    const querySongs = {
      text: `SELECT songs.id, songs.title, songs.performer
             FROM songs
             JOIN playlist_songs ON playlist_songs.song_id = songs.id
             WHERE playlist_songs.playlist_id = $1`,
      values: [playlistId],
    };

    const [resultPlaylist, resultSongs] = await Promise.all([
      this.pool.query(queryPlaylist),
      this.pool.query(querySongs),
    ]);

    // if (!resultPlaylist.rows.length) {
    //   throw new NotFoundError('Playlist tidak ditemukan');
    // }

    return {
      ...resultPlaylist.rows[0],
      songs: resultSongs.rows,
    };
  }
}

module.exports = PlaylistsService;
