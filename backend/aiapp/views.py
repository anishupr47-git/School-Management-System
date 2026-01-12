import os
import requests
from rest_framework.decorators import api_view,permission_classes
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
@api_view(["POST"])
@permission_classes([IsAuthenticated])
def chat(request):
    message=request.data.get("message","")
    if not message:
        return Response({"detail":"message is required."},status=status.HTTP_400_BAD_REQUEST)
    token=os.getenv("HF_TOKEN","")
    model=os.getenv("HF_MODEL","google/flan-t5-small")
    url=f"https://api-inference.huggingface.co/models/{model}"
    headers={}
    if token:
        headers["Authorization"]=f"Bearer {token}"
    payload={"inputs":message}
    try:
        r=requests.post(url,headers=headers,json=payload,timeout=30)
        if r.status_code==503:
            return Response({"reply":"Model is loading, try again in a moment."},status=status.HTTP_200_OK)
        if not r.ok:
            return Response({"detail":"AI request failed.","raw":r.text},status=status.HTTP_400_BAD_REQUEST)
        data=r.json()
        reply=""
        if isinstance(data,list) and len(data)>0 and isinstance(data[0],dict) and "generated_text" in data[0]:
            reply=data[0]["generated_text"]
        elif isinstance(data,dict) and "generated_text" in data:
            reply=data["generated_text"]
        else:
            reply=str(data)
        return Response({"reply":reply},status=status.HTTP_200_OK)
    except Exception:
        return Response({"detail":"AI request error."},status=status.HTTP_400_BAD_REQUEST)
