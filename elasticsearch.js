var elasticsearch = require('elasticsearch');

var indexName = "index";
var _type = "word";

var connectionString = process.env.SEARCHBOX_URL;

var serviceOptions = {
    host: connectionString
    , log: 'trace'
};


var elasticClient = new elasticsearch.Client(serviceOptions);

function performance(term, termToSearch) {
    var _search;

    var _search_all = {
        index: indexName,
        type: _type,
        body: {
            query: {
                multi_match: {
                    query: termToSearch,
                    type: "most_fields",
                    fields: ["paragraphs", "contacts", "body", "read_more"],
                    operator: "and" //default
                }
            }
        }
    };
    var _searchPage = {
        index: indexName,
        type: _type,
        body: {
            query: {
                regexp: {
                    page: termToSearch + ".*"
                }
            }
        }
    };

    switch (term) {
        case "page":
            _search = _searchPage;
            break;
        case "search":
            _search = _search_all;
            break;
        default:
    }

    return elasticClient.search(_search).then(function (res) {
        return res;
    });
}

exports.performance = performance;


function indexExists() {
    return elasticClient.indices.exists({
        index: indexName
    });
}
exports.indexExists = indexExists;

function initIndex() {
    return elasticClient.indices.create({
        index: indexName
    });
}
exports.initIndex = initIndex;

function deleteIndex() {
    return elasticClient.indices.delete({
        index: indexName
    });
}
exports.deleteIndex = deleteIndex;

/**
 * 
 * @returns {unresolved}
 */
function initMapping() {
    return elasticClient.indices.putMapping({
        index: indexName,
        type: _type,
        id: "long",
        body: {
            mappings: {
                _all: {enabled: true},
                id: {
                    properties: {
                        type: "long"
                    }
                }, page: {
                    properties: {
                        type: "string"
                    }
                }, title: {
                    properties: {
                        type: "string"
                    }
                }, section: {
                    properties: {
                        type: "string"
                    }
                }, img: {
                    properties: {
                        type: "string"
                    }
                }, body: {
                    properties: {
                        type: "string"
                    }
                }, read_more: {
                    properties: {
                        link: {
                            properties: {
                                type: "string"
                            }
                        }, read: {
                            properties: {
                                type: "string"
                            }
                        }
                    }
                }, paragraphs: {
                    properties: {
                        type: "string"
                    }
                }, contacts: {
                    properties: {
                        properties: {
                            type: "string"
                        }
                    }
                }
            }
        }
    });
}
exports.initMapping = initMapping;

function addDocument(dataJSON) {

    return elasticClient.index({
        index: indexName,
        type: _type,
        id: dataJSON.id,
        body: {
            id: dataJSON.id,
            page: dataJSON.page,
            title: dataJSON.title,
            section: dataJSON.section,
            img: dataJSON.img,
            body: dataJSON.body,
            read_more: dataJSON.read_more,
            paragraphs: dataJSON.paragraphs,
            contacts: dataJSON.contacts
        }
    });
}
exports.addDocument = addDocument;

function status() {
    return elasticClient.cluster.health(function (err, resp) {
        if (err) {
            console.error(err.message);
        } else {
            console.dir(resp);
        }
    });
}

exports.status = status;