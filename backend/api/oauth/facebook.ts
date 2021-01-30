/*
 * Copyright (c) 2020-2021 Cynthia K. Rey, All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are met:
 *
 * 1. Redistributions of source code must retain the above copyright notice, this
 *    list of conditions and the following disclaimer.
 * 2. Redistributions in binary form must reproduce the above copyright notice,
 *    this list of conditions and the following disclaimer in the
 *    documentation and/or other materials provided with the distribution.
 * 3. Neither the name of the copyright holder nor the names of its contributors
 *    may be used to endorse or promote products derived from this software without
 *    specific prior written permission.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND
 * ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
 * WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
 * DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE
 * FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL
 * DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR
 * SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER
 * CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY,
 * OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
 * OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */

import type { FastifyInstance } from 'fastify'
import fetch from 'node-fetch'

import register from './abstract/oauth2'
import type { ExternalUser } from './abstract/shared'

const config = require('../../../config.json')
const [ clientId, clientSecret ] = config.oauth.facebook

async function getSelf (token: string, state: string): Promise<ExternalUser | null> {
  const data = await fetch('https://graph.facebook.com/v9.0/me', { headers: { authorization: `Bearer ${token}` } })
    .then(r => r.json())

  const encodedId = state.split(';;;')[1]
  if (!encodedId) return null

  const realId = Buffer.from(encodedId, 'base64').toString()
  console.log(data, realId) // todo: check if the harvested ID and the provided ID match

  // Ensure authorization screen will be prompted again
  await fetch('https://graph.facebook.com/v9.0/me/permissions', { method: 'DELETE', headers: { authorization: `Bearer ${token}` } })
  return null as any
}

export default async function (fastify: FastifyInstance) {
  register(fastify, {
    clientId,
    clientSecret,
    platform: 'facebook',
    authorization: 'https://www.facebook.com/v9.0/dialog/oauth',
    token: 'https://graph.facebook.com/v9.0/oauth/access_token',
    scopes: [],
    getSelf,
    transformState: (state) => state.split(';;;')[0],
    authProps: { auth_type: 'reauthorize' },
  })
}