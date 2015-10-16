#!/usr/bin/env python

import os
from flask import Flask, request
import pickle

app = Flask(__name__)
# app.config['DEBUG'] = True

def loadTables(methodlist, curve, bound):
    return [pickle.load(
        open(os.path.join(os.curdir, 'curves', curve, bound + method)))
            for method in methodlist]

def printTable(L, degl, degh, ql, qh, methodlist):
    resp = ''
    resp += '<table id = "resultstable"><thead>'
    resp += '<tr>'
    resp += '<th scope = "col"> degC\Cq </th>'
    for i in range(ql, qh + 1):
        resp += '<th scope = "col"> %s </th>' % i
    resp += '</tr></thead>'
    resp += '<tbody>'
    for deg in range(degl, degh + 1):
        for num, method in enumerate(methodlist):
            line = L[num][deg]
            last_Q = ' id = "last" ' if num == len(methodlist) - 1 else ''
            resp += '<tr %s>' % last_Q
            resp += '<th> %s %s </th>' % (deg, method)
            maxval = max(line)
            for i in range(ql, qh + 1):
                val = L[num][deg][i]
                if val == maxval:
                    resp += '<td><span id = "max">' + str(val) + '</span></td>'
                else:
                    resp += '<td>' + str(val) + '</td>'
            resp += '</tr>'
    resp += '</tbody>'
    resp += '</table>'
    resp += '<p>Highest numbers is a row are marked in red.</p>'
    return resp

@app.route('/table', methods=['GET', 'POST'])
def table():
    args = request.form
    curve = args.get('curve')
    methodlist = args.get('methods').split(',')
    bound = args.get('bound')
    if bound == 'C':
        bound += args.get('point')
    degl = args.get('degl')
    degh = args.get('degh')
    ql = args.get('ql')
    qh = args.get('qh')
    if not degl.isdigit() or not degh.isdigit() or not ql.isdigit() or not qh.isdigit():
        return 'Enter only numbers!'

    degl, degh, ql, qh = map(int, [degl, degh, ql, qh])
    L = loadTables(methodlist, curve, bound)
    if not 0 <= degl <= degh < len(L[0]) or not 0 <= ql <= qh < len(L[0][0]):
        return 'Bad Range, check again'
    if len(methodlist) * (degh - degl) * (qh - ql) > 1000:
        return 'Table is too big to display. Narrow the range.'
    return printTable(L, degl, degh, ql, qh, methodlist)

@app.errorhandler(404)
def page_not_found(e):
    """Return a custom 404 error."""
    return 'Sorry, nothing at this URL.', 404
