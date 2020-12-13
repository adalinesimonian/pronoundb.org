/*
 * Copyright (c) 2020 Cynthia K. Rey, All rights reserved.
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

export function h (tag, props, ...child) {
  const e = document.createElement(tag)
  if (props) {
    for (const key in props) {
      if (Object.prototype.hasOwnProperty.call(props, key)) {
        e.setAttribute(key, String(props[key]))
      }
    }
  }

  for (const c of child) {
    if (!c) continue
    e.appendChild(typeof c === 'string' ? document.createTextNode(c) : c)
  }

  return e
}

export function css (style) {
  let res = ''
  for (const prop in style) {
    if (Object.prototype.hasOwnProperty.call(style, prop)) {
      res += `${prop.replace(/[A-Z]/g, s => `-${s.toLowerCase()}`)}:${style[prop]};`
    }
  }
  return res
}

export function sleep (ms) {
  return new Promise(res => setTimeout(res, ms))
}

export function createDeferred () {
  let deferred = {}
  deferred.promise = new Promise(resolve => Object.assign(deferred, { resolve }))
  return deferred
}
