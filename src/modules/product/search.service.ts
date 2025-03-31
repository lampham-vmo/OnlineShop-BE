import { Injectable, Logger } from "@nestjs/common";
import { ElasticsearchService } from "@nestjs/elasticsearch";
import { ProductResponse } from "./DTO/response/product.response";

@Injectable()
export class SearchService{
    constructor(private readonly esService:ElasticsearchService){}

    public async createIndex(){
        const index = "product"
        const checkIndex = await this.esService.indices.exists({index})
        if(!checkIndex){
            this.esService.indices.create(
                {
                    index,
                    body: {
                        mappings: {
                          properties: {
                            id: {
                              type: 'keyword',
                            },
                            name: {
                              type: 'text',
                              fields: {
                                keyword: {
                                  type: 'keyword', 
                                  ignore_above: 256,
                                },
                              },
                            },
                            price: {
                              type: 'float',
                            },
                            stock: {
                              type: 'integer',
                            },
                            discount: {
                              type: 'float',
                            },
                            image: {
                              type: 'text',
                              index: false,
                            },
                            priceAfterDis: {
                              type: 'float',
                            },
                            category: {
                                type:"object",
                                properties: {
                                    name: {
                                        type: "text",
                                        fields: {
                                            keyword: {
                                                type: "keyword"
                                            }
                                        }
                                    },
                                    description: {
                                        type: "text",
                                        index: false
                                    }
                                }
                            }
                          },
                        },
                        settings: {
                          analysis: {
                            filter: {
                              autocomplete_filter: {
                                type: 'edge_ngram',
                                min_gram: 1,
                                max_gram: 20,
                              },
                            },
                            analyzer: {
                              autocomplete: {
                                type: 'custom',
                                tokenizer: 'standard',
                                filter: ['lowercase', 'autocomplete_filter'],
                              },
                            },
                          },
                        },
                    },
                }
            );     
        }
    }

    public async indexProduct(product: ProductResponse){
        return await this.esService.index({
            index: "product",
            body: product,
        });
    }

    public async removeProduct(productId: number){
        return await this.esService.deleteByQuery({
            index: "product",
            body: {
                query: {
                    match: {
                        id: productId
                    }
                }
            }
        })
    }

    public async findProduct(text: string){
        const response = await this.esService.search({
            index: "product",
            body: {
                query: {


                                multi_match: {
                                    query: text,
                                    fields: ["name","category"],
                                    fuzziness: "AUTO"
                                }



                }
            }
        })
        return response.hits.hits.map(hit => hit._source as Partial<ProductResponse>);
    }
}
