'use strict'

const PeerId = require('@arve.knudsen/peer-id')
const PeerInfo = require('@arve.knudsen/peer-info')
const multiaddr = require('multiaddr')

/**
 * Helper method to check the data type of peer and convert it to PeerInfo
 *
 * @param {PeerInfo|Multiaddr|PeerId} peer
 * @param {PeerBook} peerBook
 * @throws {InvalidPeerType}
 * @returns {PeerInfo}
 */
function getPeerInfo (peer, peerBook) {
  let peerInfo

  // Already a PeerInfo instance,
  // add to the peer book and return the latest value
  if (PeerInfo.isPeerInfo(peer)) {
    return peerBook.put(peer)
  }

  // Attempt to convert from Multiaddr instance (not string)
  if (multiaddr.isMultiaddr(peer)) {
    const peerIdB58Str = peer.getPeerId()
    try {
      peerInfo = peerBook.get(peerIdB58Str)
    } catch (err) {
      peerInfo = new PeerInfo(PeerId.createFromB58String(peerIdB58Str))
    }
    peerInfo.multiaddrs.add(peer)
    return peerInfo
  }

  // Attempt to convert from PeerId
  if (PeerId.isPeerId(peer)) {
    const peerIdB58Str = peer.toB58String()
    try {
      return peerBook.get(peerIdB58Str)
    } catch (err) {
      throw new Error(`Couldnt get PeerInfo for ${peerIdB58Str}`)
    }
  }

  throw new Error('peer type not recognized')
}

module.exports = getPeerInfo
